import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDelayedFlag } from "./useDelayedFlag";

describe("useDelayedFlag", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("reste à false tant que le délai n'est pas écoulé", () => {
        const { result } = renderHook(() => useDelayedFlag(true, 300));

        act(() => vi.advanceTimersByTime(299));

        expect(result.current).toBe(false);
    });

    it("passe à true une fois le délai écoulé", () => {
        const { result } = renderHook(() => useDelayedFlag(true, 300));

        act(() => vi.advanceTimersByTime(300));

        expect(result.current).toBe(true);
    });

    it("ne passe jamais à true si l'attente se termine avant le délai", () => {
        const { result, rerender } = renderHook(({ active }) => useDelayedFlag(active, 300), {
            initialProps: { active: true },
        });

        act(() => vi.advanceTimersByTime(150));
        rerender({ active: false });
        act(() => vi.advanceTimersByTime(500));

        expect(result.current).toBe(false);
    });

    it("revient à false dès que l'attente se termine, puis repart de zéro", () => {
        const { result, rerender } = renderHook(({ active }) => useDelayedFlag(active, 300), {
            initialProps: { active: true },
        });

        act(() => vi.advanceTimersByTime(300));
        expect(result.current).toBe(true);

        rerender({ active: false });
        expect(result.current).toBe(false);

        rerender({ active: true });
        expect(result.current).toBe(false);
        act(() => vi.advanceTimersByTime(300));
        expect(result.current).toBe(true);
    });
});
