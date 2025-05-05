export const getOilBrandImage = (brandNameTh: string): string => {
    switch (brandNameTh) {
        case "บางจาก":
            return "/assets/img/gas/2.png";
        case "ปตท.":
            return "/assets/img/gas/1.png";
        case "เชลล์":
            return "/assets/img/gas/3.png";
        case "คาลเท็กซ์":
            return "/assets/img/gas/4.png";
        case "พีที":
            return "/assets/img/gas/5.png";
        default:
            return "/assets/img/gas/bangchak.png";
    }
};
