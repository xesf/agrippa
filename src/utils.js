import fs from 'fs';

export const getHotspots = (filepath) => {
    let offset = 4;
    const hotspots = [];

    const fc = fs.readFileSync(filepath);
    const buffer = fc.buffer.slice(fc.byteOffset, fc.byteOffset + fc.byteLength);

    const data = new DataView(buffer);
    const numHotpots = data.getUint16(offset, true);
    offset += 4;

    for (let h = 0; h < numHotpots; h += 1) {
        const hot = {
            unk1: data.getUint32(offset, true),
            x1: data.getUint16(offset + 4, true),
            y1: data.getUint16(offset + 6, true),
            x2: data.getUint16(offset + 8, true),
            y2: data.getUint16(offset + 10, true),
            unk2: data.getUint32(offset + 12, true),
            unk3: data.getUint32(offset + 16, true),
        };
        hotspots.push(hot);
        offset += 20;
    }
    return hotspots;
};
