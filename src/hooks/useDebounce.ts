import { Accessor, createEffect, createSignal, on, onCleanup } from "solid-js";

export default function useDebounce<T>(signal: Accessor<T>, delay: number = 0) {
    const [debouncedSignal, setDebouncedSignal] = createSignal<T>(signal());

    let timerHandle: number;

    createEffect(
        on(signal, (s) => {

            timerHandle = setTimeout(() => {
                setDebouncedSignal(() => s);
            }, delay);

            onCleanup(() => clearTimeout(timerHandle));
        })
    );
    return debouncedSignal;
}