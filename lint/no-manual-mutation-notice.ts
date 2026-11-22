import { definePlugin, defineRule } from "vite-plus/lint/plugins";

type Node = { type: string; [key: string]: unknown };

const isNotificationsCall = (callee: Node, method: string) => {
	if (callee.type !== "MemberExpression") {
		return false;
	}
	const object = callee.object as Node;
	const property = callee.property as Node;
	return (
		object.type === "Identifier" &&
		object.name === "notifications" &&
		property.type === "Identifier" &&
		property.name === method
	);
};

const hasLoading = (argument: Node | undefined) => {
	if (argument?.type !== "ObjectExpression") {
		return false;
	}
	return (argument.properties as Node[]).some((property) => {
		const key = property.key as Node | undefined;
		return property.type === "Property" && key?.type === "Identifier" && key.name === "loading";
	});
};

const noManualMutationNotice = defineRule({
	meta: {
		messages: {
			manual:
				"送信中から結果への通知を手で組まない。更新は notifyMutation（shared/lib）で知らせる（docs/adr/0007）。",
		},
	},
	create(context) {
		return {
			CallExpression(node) {
				const callee = node.callee as unknown as Node;
				const [argument] = node.arguments as unknown as Node[];
				if (
					isNotificationsCall(callee, "update") ||
					(isNotificationsCall(callee, "show") && hasLoading(argument))
				) {
					context.report({ node, messageId: "manual" });
				}
			},
		};
	},
});

export default definePlugin({
	meta: { name: "mutation-notice" },
	rules: { "no-manual": noManualMutationNotice },
});
