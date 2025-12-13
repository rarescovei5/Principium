export const safeSegment = (value: string) =>
    value.trim().replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');