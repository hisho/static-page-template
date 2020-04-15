import { UAParser } from 'ua-parser-js';

const parser: IUAParser.IResult = new UAParser().getResult();

const {
  browser: { name: browserName },
  os: { name: osName },
  device: { model: deviceModel, type: deviceType = 'pc' },
} = parser;

function test(x: string | undefined): string {
  if (x !== undefined) {
    const uaName: string = x.replace(/\s/g, '-').toLowerCase();
    document.body.classList.add(uaName);
    return uaName;
  }
}

type userAgentList = {
  browserName: string;
  osName: string;
  deviceType: string;
  deviceModel: string | null;
};

export const userAgentList: userAgentList = {
  browserName: test(browserName),
  osName: test(osName),
  deviceType: test(deviceType),
  deviceModel: test(deviceModel),
};
