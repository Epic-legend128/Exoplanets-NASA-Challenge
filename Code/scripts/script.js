//let url = "https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND=%27499%27&OBJ_DATA=%27YES%27&MAKE_EPHEM=%27YES%27&EPHEM_TYPE=%27OBSERVER%27&CENTER=%27500@399%27&START_TIME=%272006-01-01%27&STOP_TIME=%272006-01-20%27&STEP_SIZE=%271%20d%27&QUANTITIES=%271,9,20,23,24,29%27";
const SPK_FILENAME = 'spk_file.bsp'
let url = 'https://ssd.jpl.nasa.gov/api/horizons.api';

const START_TIME = '2030-01-01';
const STOP_TIME = '2031-01-01';
const CENTER = "500@sun";
const STEP_SIZE = "86400";
const QUANTITIES = "1,9,20,23,24,29";

const SPK_ID = 499; // Mars, https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/AAREADME_Satellite_SPKs

url += "?format=json&EPHEM_TYPE=%27VECTOR%27&OBJ_DATA=%27YES%27&MAKE_EPHEM=%27YES%27"
url += `&STEP_SIZE=%27${STEP_SIZE}%27&COMMAND=%27${SPK_ID}%27&START_TIME=%27${START_TIME}%27&STOP_TIME=%27${STOP_TIME}%27&CENTER=%27${CENTER}%27&QUANTITIES=%27${QUANTITIES}%27`;

console.log(url);
let response = fetch(url).then(data => {
    console.log("Fetch worked with: ");
    console.log(data);
    data.json().then(d => {
        console.log(d);
        console.log(d.result);
        filterResults(d.result);
    })
}).catch(err => {
    console.error("There was an error", err);
});

function filterResults(data) {
    let rows = data.match(/^ ?X *=[\dE\-+ .]*Y *=[\dE\-+ .]*Z *=[\dE\-+ .]*$/gm);
    console.log(rows);
    console.log(rows.length);
}