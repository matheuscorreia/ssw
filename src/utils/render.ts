export const adjustValueToPixelDensity = (value: number) => {
    return Math.round((value / devicePixelRatio) * devicePixelRatio);
}