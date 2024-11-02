export const convertSize = (size: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
    }
    return `${size.toFixed(2)} ${units[index]}`;
};

import ffprobe from 'ffprobe-static';
import { execFile } from 'child_process';
import util from 'util';

const execFilePromise = util.promisify(execFile);

export const getVideoDuration = async (path: string): Promise<number> => {
    const { stdout } = await execFilePromise(ffprobe.path, [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        path,
    ]);
    return parseFloat(stdout);
};
