import Decision from './ui/components/gameplay/Decision';
import Location from './ui/components/gameplay/Location';
import Hotspots from './ui/components/gameplay/Hotspots';

// eslint-disable-next-line
const render = async () => {
    // eslint-disable-next-line
    await import(/* webpackIgnore: true */ './palanca-studio.js');
    // eslint-disable-next-line
    let RenderApp = window['palanca-studio'].default;

    RenderApp({
        codename: 'agrippa',
        title: 'X-Files The Game Remake',
        width: 640,
        height: 480,
        Decision,
        Location,
        Hotspots,
    });
};

render();
