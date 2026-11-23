/**
 * Giant footer wordmark (decorative, aria-hidden). ANIM: SplitText chars inside the
 * overflow-clip mask [data-wordmark-mask]; hover lift; cursor state "hide".
 */
export function Wordmark({ text }: { text: string }) {
  return (
    <div aria-hidden="true" data-wordmark-mask="" data-cursor="hide" className="overflow-clip">
      <p
        data-anim="chars"
        data-wordmark=""
        className="whitespace-nowrap text-center font-serif text-wordmark text-bone"
      >
        {text}
      </p>
    </div>
  );
}
