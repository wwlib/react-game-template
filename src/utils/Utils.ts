const getEnumLabels = <Type>(arg: Type): string[] => {
    const result: string[] = [];
    for (const elementType of Object.values(arg)) {
        const elementIndex: any = Number(elementType);
        if (!isNaN(elementIndex)) {
            const elementLabel = (arg as any)[elementIndex];
            result.push(elementLabel)
        }
    }
    return result;
}

const getEnumLabelsAndIndices = <Type>(arg: Type): any[] => {
    const result: any[] = [];
    for (const elementType of Object.values(arg)) {
        const elementIndex: any = Number(elementType);
        if (!isNaN(elementIndex)) {
            const elementLabel = (arg as any)[elementIndex];
            result.push({ label: elementLabel, index: elementIndex });
        }
    }
    return result;
}

const getEnumIndices = <Type>(arg: Type): number[] => {
    const result: number[] = [];
    for (const elementType of Object.values(arg)) {
        const elementIndex: any = Number(elementType);
        if (!isNaN(elementIndex)) {
            result.push(elementIndex)
        }
    }
    return result;
}

export {
    getEnumLabels,
    getEnumLabelsAndIndices,
    getEnumIndices,
}