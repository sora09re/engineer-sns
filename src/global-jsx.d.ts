/**
 * React 19 の型定義からグローバルの JSX 名前空間が消えたため、React.JSX へつなぐ。
 * Mantine v6 の型定義（ポリモーフィックコンポーネントなど）がグローバルの JSX を参照しており、
 * これがないと Box や Button の props の型が付かなくなる。
 * TODO: Mantine を v7 以降に上げたら、このファイルを消す。
 */
import type { JSX as ReactJSX } from "react";

declare global {
	namespace JSX {
		type ElementType = ReactJSX.ElementType;
		interface Element extends ReactJSX.Element {}
		interface ElementClass extends ReactJSX.ElementClass {}
		interface ElementAttributesProperty extends ReactJSX.ElementAttributesProperty {}
		interface ElementChildrenAttribute extends ReactJSX.ElementChildrenAttribute {}
		type LibraryManagedAttributes<C, P> = ReactJSX.LibraryManagedAttributes<C, P>;
		interface IntrinsicAttributes extends ReactJSX.IntrinsicAttributes {}
		interface IntrinsicClassAttributes<T> extends ReactJSX.IntrinsicClassAttributes<T> {}
		interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
	}
}
