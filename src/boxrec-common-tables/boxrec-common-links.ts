export class BoxrecCommonLinks {

    static parseLinks<T>(hrefArr: string[], href: string, obj: T): T {
        hrefArr.forEach((cls: string) => {
            if (cls !== "primaryIcon") {
                const matches: RegExpMatchArray | null = href.match(/([\d\/]+)$/);
                if (matches && matches[1] && matches[1] !== "other") {

                    let formattedCls: string = cls;
                    // for some reason they add a `P` to the end of the class name, we will remove it
                    if (cls.slice(-1) === "P") {
                        formattedCls = cls.slice(0, -1);
                    }

                    if (matches[1].includes("/")) {
                        (obj as any)[formattedCls] = matches[1].substring(1);
                    } else {
                        (obj as any)[formattedCls] = parseInt(matches[1], 10);
                    }

                } else {
                    (obj as any).other.push(href);
                }
            }
        });

        return obj;
    }

}
