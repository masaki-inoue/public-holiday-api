import fetch from 'node-fetch';
import { JP_PUBLIC_HOLIDAY_CALENDAR_ID, GOOGLEAPI_HOST } from './constants';
import { DateObject } from './date';

require('dotenv').config();

if (!process.env.GCP_API_KEY) {
  console.error("`GCP_API_KEY` isn't defined properly.");
  process.exit(2);
}
const API_KEY = process.env.GCP_API_KEY;

async function main() {
  const calendarID = encodeURIComponent(JP_PUBLIC_HOLIDAY_CALENDAR_ID);
  const url = new URL(
    `/calendar/v3/calendars/${calendarID}/events`,
    GOOGLEAPI_HOST
  );
  const startYear = 2020;
  const endYear = 2025;
  const dateFormat = 'YYYY-MM-DD';
  const startDate = DateObject.create(
    `${startYear}-01-01`,
    dateFormat,
    'ja',
    true
  );
  const endDate = DateObject.create(`${endYear}-12-31`, dateFormat, 'ja', true);
  const query = {
    key: API_KEY,
    timeMin: startDate.toISOString(),
    timeMax: endDate.toISOString(),
    timeZone: 'JST',
  };
  const urlSearchParams = new URLSearchParams(query);
  url.search = urlSearchParams.toString();

  const response = await fetch(url.toJSON());

  if (!response.ok) {
    console.error(
      `イベント取得失敗 status: ${response.status} ${JSON.stringify(
        await response.json()
      )}`
    );
    process.exit(2);
  }
  const body: GoogleCalendarEvent = await response.json();
  const publicHolidays: PublicHoliday = {};
  body.items.forEach((item) => {
    if (!item.start.date) {
      return;
    }

    const startDate_ = DateObject.create(
      item.start.date,
      dateFormat,
      'ja',
      true
    );

    publicHolidays[startDate_.year()] = publicHolidays[startDate_.year()] ?? {};
    publicHolidays[startDate_.year()] = {
      ...publicHolidays[startDate_.year()],
      [item.start.date]: item.summary,
    };
  });

  const responseBody: ResponseBody = {
    result: publicHolidays,
  };

  console.log(JSON.stringify(responseBody, null, 2));
}

main();

interface ResponseBody {
  result: PublicHoliday;
}
interface PublicHoliday {
  [year: string]: {
    [name: string]: string; // '元旦': 'YYYY-01-01'
  };
}

interface GoogleCalendarEvent {
  kind: string;
  etag: string;
  summary: string;
  updated: string;
  timeZone: string; // 'UTC'
  accessRole: string;
  defaultReminders: unknown[];
  nextPageToken?: string; // 次のページが存在しない場合は undefined
  nextSyncToken: string;
  items: GoogleCalendarEventItem[];
}
interface GoogleCalendarEventItem {
  kind: string;
  etag: string;
  id: string;
  status: 'confirmed';
  htmlLink: string;
  created: string;
  updated: string;
  summary: string; // 祝日名。「休日 山の日」のように謎のprefix入ってるものもあるのでクリーニングする必要はありそう
  creator: {
    email: string;
    displayName: string; // 「日本の祝日」
    self: true;
  };
  organizer: {
    email: string;
    displayName: string; // 「日本の祝日」
    self: true;
  };
  start: GoogleCalendarEventDateTime;
  end: GoogleCalendarEventDateTime;
  transparency: 'transparent';
  visibility: 'public';
  iCalUID: string;
  sequence: number;
  eventType: 'default' | 'outOfOffice'; // 'default'
}

interface GoogleCalendarEventDateTime {
  date?: string;
  dateTime?: string;
  timeZome?: string;
}
