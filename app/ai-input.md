
Thema:

Wir sind ein Maschinenbau-Unternehmen in der Agrarwirtschaft. Wir bauen seit 1997 Traktoren und sind Inhabergeführt
von Dr. Ing. Subert. Wir beschäftigen 140 Mitarbeiter.

Aufgabe:
Es soll ein Blogartikel über alle Arten von Motoren erstellt werden. Der aktuelle Abschnitt behandelt
das Thema "Was ist ein Motor?"

```typescript
type Artikel = {
    Titel: string,
    Headline: string
    Gliederung: Gliederung[]
}

type Gliederung = {
    titel: string
    frage: string
}
```

Erzeuge Titel, die Headline, Gliederungspunkte mit titel und einer Frage, die der folgende text dieser Gliederung beantworten soll.
Gib deine Ergebnisse als JSON vom Typ "Artikel" zurück.

----


Wir sind ein Unternehmen, dass Texterstellung anbietet. Wir sind neu auf dem Markt und bieten
Texterstellung zum Festpreis an. Erzeuge einen Text zum Gliederungspunkt "Unser Angebot" für die Pressemitteilung.
