import {
	ActionIcon,
	CopyButton as MantineCopyButton,
	Tooltip,
} from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons";

interface CopyButtonProps {
	value: string;
}

export const CopyButton = ({ value }: CopyButtonProps) => {
	return (
		<MantineCopyButton value={value} timeout={2000}>
			{({ copied, copy }) => {
				return (
					<Tooltip
						label={copied ? "Copied" : "Copy"}
						withArrow
						position="right"
					>
						<ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
							{copied ? (
								<IconCheck size="1.5rem" />
							) : (
								<IconCopy size="1.5rem" />
							)}
						</ActionIcon>
					</Tooltip>
				);
			}}
		</MantineCopyButton>
	);
};
