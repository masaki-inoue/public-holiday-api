# 祝日取得 API を構築する際のメモ

1. 「API とサービス」から `Google Calendar API` を有効化する
1. `Google Calendar API` の認証情報をを作成する
   - 「API キー」を生成する
   - キーに対する権限がデフォルトでは制限無しになっているので、 `Google Calendar API` のみに絞る
1. [カレンダーのイベント一覧取得 API](https://developers.google.com/calendar/v3/reference/events/list) のリファレンスを読んで、実装する。
   - 「日本の祝日」カレンダー ID は `japanese__ja@holiday.calendar.google.com`
