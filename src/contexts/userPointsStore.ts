import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const usePointStore = (): { points: Writable<number>, updatePoints: (data: number) => void } => {
    const points = writable<number>(0);
    const updatePoints = (data: number) => points.set(data);
    return {
        points,
        updatePoints
    };
};