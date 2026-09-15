# DER KREIS Marketing Hub

Interne, Nederlandstalige marketingwerkplek waarin een **Marketingitem** het centrale ticket is, met taken per medewerker en rapportage per communicatieprofiel. De app gebruikt Next.js App Router, TypeScript, Tailwind en Supabase (PostgreSQL, Auth, Storage en RLS).

## Direct starten

```bash
npm install
cp .env.example .env.local
npm run dev
```

Zonder credentials toont de applicatie een melding dat gegevens niet kunnen worden geladen. Configureer Supabase om data te bekijken en mutaties uit te voeren.

## Supabase instellen

1. Maak een Supabase-project en plaats URL en anon key in `.env.local`.
2. Koppel lokaal met `npx supabase link --project-ref <ref>`.
3. Voer `npx supabase db push` uit; dit installeert tabellen, constraints, indexes, businessregels, RLS en de private Storage-bucket.
4. Voer in de SQL editor `supabase/seed.sql` uit.
5. Zet **public registration uit** onder Authentication → Providers → Email. Gebruikers worden uitsluitend door een admin uitgenodigd.
6. Maak de medewerkers aan via Authentication → Users (of de toekomstige admin invite-route) en voeg voor elk auth-id een rij aan `public.profiles` toe met de gewenste rol.
7. Stel Site URL en redirect URL in. Wachtwoordherstel gebruikt Supabase Auth en `NEXT_PUBLIC_APP_URL`.

De `SUPABASE_SERVICE_ROLE_KEY` is uitsluitend bedoeld voor een server-side admin-invite handler. Gebruik hem nooit in een `NEXT_PUBLIC_*` variabele. De browser gebruikt alleen de anon key; daadwerkelijke rechten worden door RLS en `has_permission()` bepaald.

## Beveiligingsmodel

- Rollen leveren standaardrechten; `user_permission_overrides` kan elk recht expliciet aan- of uitzetten.
- Viewer krijgt uitsluitend SELECT-rechten. UI-verbergen is niet de beveiligingsgrens: policies controleren iedere databaseactie.
- Het auditlog heeft geen update/delete-policy en is daardoor onveranderbaar via clients.
- Uploads staan in een private bucket, maximaal 20 MB, met een MIME allowlist en een gebruikersmap als eerste padsegment.
- Afronden/archiveren van een item faalt in PostgreSQL zolang verplichte taken nog open zijn.
- Urenverdelingen kunnen met `validate_time_allocations(task_id)` worden gevalideerd; bij één profiel wordt het totaal automatisch toegewezen.

## Structuur

- `app/` — routes voor dashboard, Mijn Werk, kalender, tickets, Weekstart, rapportage, archief en beheer.
- `components/` — navigatie en herbruikbare tabellen/KPI/statuscomponenten.
- `lib/` — Supabase-clients, dataqueries en presentatiehelpers.
- `supabase/migrations/` — volledig relationeel schema, RLS, Storage en workflowregels.
- `supabase/seed.sql` — rollen, rechten, profielenmerken, kanalen, typen, instellingen en voorbeeldtemplates.

## Kwaliteitschecks

```bash
npm run typecheck
npm run lint
npm run build
```

## Belangrijke keuzes

- Een taak heeft via `assignee_id NOT NULL` exact één hoofdverantwoordelijke; standalone interne taken hebben een lege `marketing_item_id`.
- Deadline, persoonlijke plandatum en publicatiedatum zijn afzonderlijke velden.
- Terugkerende items gebruiken een unieke `(rule_id, occurrence_date)` om dubbele generatie te voorkomen.
- Soft delete is toegepast op werkdata; audit- en resultaatinformatie blijft beschikbaar voor archief en rapportages.
