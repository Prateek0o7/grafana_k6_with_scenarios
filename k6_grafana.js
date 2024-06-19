import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';

let baseUrl = 'https://qapb.cognitionfoundry.io';

export let options = {
    scenarios: {
        createBranch: {
            executor: 'constant-vus',
            vus: 1,
            duration: '30s',
            exec: 'createBranch',
        },
        createProcessor: {
            executor: 'constant-vus',
            vus: 1,
            duration: '30s',
            exec: 'createProcessor',
            startTime: '30s', // Starts after the createBranch scenario ends
        },
    },
};

function getRandomPhoneNumber() {
    let phone = '+63';
    for (let i = 0; i < 10; i++) {
        phone += Math.floor(Math.random() * 10).toString();
    }
    return phone;
}

function generateUniqueDeviceID() {
    const format = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let deviceId = '';
    
    for (let i = 0; i < format.length; i++) {
        deviceId += format[i] === 'X' ? characters.charAt(Math.floor(Math.random() * characters.length)) : format[i];
    }
    
    return deviceId;
}

export function createBranch() {
    let phone = getRandomPhoneNumber();
    let registerPayload = JSON.stringify({
        "firstName": "test",
        "lastName": "test",
        "phone": phone,
        "password": "123456a",
        "deviceId": generateUniqueDeviceID(),
        "deviceToken": "19B5A5B2-4A9C-4294-897B-720425701A92",
        "postLocation": { "lat": "", "lng": "" }
    });

    let registerParams = {
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'ionic://localhost',
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
            'App-Version': '2.0.0',
            'Host': 'qapb.cognitionfoundry.io'
        },
    };

    let res = http.post(baseUrl + '/register', registerPayload, registerParams);
    check(res, { 'status was 200': (r) => r.status == 200 });
    console.log('Response body for Register--: ', res.body);

    let responseBody = JSON.parse(res.body);
    let phoneValue = responseBody.phone;
    let registerId = responseBody.id;

    sleep(1);

    let loginPayload = JSON.stringify({
        phoneNumber: phoneValue,
        pin: "123456a",
        deviceToken: "19B5A5B2-4A9C-4294-897B-720425701A92",
        postLocation: { lat: "", lng: "" }
    });

    let loginResponse = http.post(baseUrl + '/login', loginPayload, registerParams);
    check(loginResponse, { 'status was 200': (r) => r.status == 200 });
    console.log('Response Login --body------------>: ', loginResponse.body);
    sleep(1);
    let loginResponseBody = JSON.parse(loginResponse.body);
    let token = loginResponseBody.token;

    let headerToken = "Bearer: " + token;
    console.log("header token------------------", headerToken);

    function getRandomBranchName() {
        const prefix = "brancha_";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = prefix;
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    const randomBranchName = getRandomBranchName();

    let branchPayload = JSON.stringify({
        name: randomBranchName,
        owner: registerId,
        phone: phoneValue,
        countryId: 'bc09d1a5-2504-4a4e-86f1-d23db437a26b',
        cityName: 'manila',
        email: '',
        avatar: null,
        description: '',
        location: 'test address',
        workingHours: '[{"dayLabelLangProp":"WORKDAYS.MONDAY","working":true,"open":"08:30","close":"17:00"},{"dayLabelLangProp":"WORKDAYS.TUESDAY","working":true,"open":"08:30","close":"17:00"},{"dayLabelLangProp":"WORKDAYS.WEDNESDAY","working":true,"open":"08:30","close":"17:00"},{"dayLabelLangProp":"WORKDAYS.THURSDAY","working":true,"open":"08:30","close":"17:00"},{"dayLabelLangProp":"WORKDAYS.FRIDAY","working":true,"open":"08:30","close":"17:00"},{"dayLabelLangProp":"WORKDAYS.SATURDAY","working":true,"open":"08:30","close":"17:00"},{"dayLabelLangProp":"WORKDAYS.SUNDAY","working":true,"open":"08:30","close":"17:00"}]',
        workingHoursObj: [
            { dayLabelLangProp: 'WORKDAYS.MONDAY', working: true, open: '08:30', close: '17:00' },
            { dayLabelLangProp: 'WORKDAYS.TUESDAY', working: true, open: '08:30', close: '17:00' },
            { dayLabelLangProp: 'WORKDAYS.WEDNESDAY', working: true, open: '08:30', close: '17:00' },
            { dayLabelLangProp: 'WORKDAYS.THURSDAY', working: true, open: '08:30', close: '17:00' },
            { dayLabelLangProp: 'WORKDAYS.FRIDAY', working: true, open: '08:30', close: '17:00' },
            { dayLabelLangProp: 'WORKDAYS.SATURDAY', working: true, open: '08:30', close: '17:00' },
            { dayLabelLangProp: 'WORKDAYS.SUNDAY', working: true, open: '08:30', close: '17:00' }
        ],
        lat: '',
        lng: '',
        createAssociatedSP: false,
        branchTypeId: '720ee024-581e-44b2-a228-a5eeb3decbfc',
        postLocation: { lat: '', lng: '' }
    });

    let branchParams = {
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'ionic://localhost',
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
            'App-Version': '2.0.0',
            'Host': 'qapb.cognitionfoundry.io',
            'Authorization': headerToken
        },
    };

    let branchResponse = http.post(baseUrl + '/cp', branchPayload, branchParams);
    check(branchResponse, { 'status was 200': (r) => r.status == 200 });
    console.log('Response Branch body------------>: ', branchResponse.body);
    sleep(1);
}

export function createProcessor() {
    // Assuming the token and branch response ID are available here
    let phone = getRandomPhoneNumber();
    let token = "some_token"; // Replace with actual token
    let branchId = "some_branch_id"; // Replace with actual branch ID

    let headerToken = "Bearer: " + token;
    console.log("header token------------------", headerToken);

    function getRandomProcessorName() {
        const prefix = "processora_";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = prefix;
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    const randomProcessorName = getRandomProcessorName();

    let processorPayload = JSON.stringify({
        serviceProviderId: branchId,
        name: randomProcessorName,
        address: 'test address',
        phone: phone,
        countryId: 'bc09d1a5-2504-4a4e-86f1-d23db437a26b',
        cityName: 'manila',
        description: 'test description',
        processorTypeId: '720ee024-581e-44b2-a228-a5eeb3decbfc',
        branchTypeId: '720ee024-581e-44b2-a228-a5eeb3decbfc',
        postLocation: { lat: '', lng: '' }
    });

    let processorParams = {
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'ionic://localhost',
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
            'App-Version': '2.0.0',
            'Host': 'qapb.cognitionfoundry.io',
            'Authorization': headerToken
        },
    };

    let processorResponse = http.post(baseUrl + '/rc', processorPayload, processorParams);
    check(processorResponse, { 'status was 200': (r) => r.status == 200 });
    console.log('Response Processor body------------>: ', processorResponse.body);
    sleep(1);
}