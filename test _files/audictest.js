import Audic from 'audic';



const audic = new Audic('../audio_files/output.mp3');

async function test() {

await audic.play();

audic.addEventListener('ended', () => {
    audic.destroy();
});
};

test();
