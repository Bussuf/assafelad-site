# BACKLOG - assafelad.com

איך לקרוא: הסדר הוא העדיפות. סטטוסים: TODO · DOING · REVIEW (נבנה ונבדק, מחכה ל-Done או לסבב נוסף) · HOLD (מחכה למשהו שנקרא בשמו) · Done · Dropped (נבנה והוסר) · Canceled (לא נדרש).
זו הבנייה של **#86** בבקלוג של הדרייב (`G:\My Drive\BACKLOG.md`). המספרים כאן מקומיים. בלי גרסאות.

## פתוח (לפי סדר עבודה)
| סדר | # | שם | בקצרה | תחום |
|---|---|---|---|---|
| 1 | | בניית האתר (#86 בדרייב) | צעדים 1-8 מהאפיון, לפי מוקאפ v7 | - |
| 1.3 | 3 | ↳ עמוד הבית | באנר "I play ___" עם Pause/Play, 3 דלתות עם Peek | עמודים |
| 1.4 | 4 | ↳ תוכן ופרויקטים | Content collections עם סכמה, עמודי Shelf (Grid/Table), עמוד showcase, חלון משחק, Download (Windows) | עמודים |
| 1.5 | 5 | ↳ About ויוקלילי | Then/Now, נושאים בלחיצה, highlights, ספריית Steam, מצב יוקלילי והרמז | עמודים |
| 1.6 | 6 | ↳ SEO ונגישות | מטא, OG, sitemap, 404; Lighthouse 90+ | איכות |
| 1.7 | 7 | ↳ ריפו ופריסה | ריפו ציבורי, GitHub Actions ל-Pages; זמנית עם `base` | פריסה |
| 1.8 | 8 | ↳ DNS | רשומות A/CNAME ב-Site123 (לא Name Servers), HTTPS. אישור נפרד | פריסה |

## בהמתנה
| # | שם | בקצרה | מחכה ל |
|---|---|---|---|

## בוצע
### תשתית
| # | שם | בקצרה |
|---|---|---|
| 2 | שלד האתר | כותרת דביקה + Hotbar, תחתית, כהה/בהיר, Rubik (Fonts API), ClientRouter בלי אנימציה, סאונד, קובייה (2026-11-21) |
| 1 | שלד Astro | Astro 7 + TS + Tailwind 4, git, CLAUDE.md, BACKLOG.md; check ו-build נקיים, עמוד ריק ב-localhost (2026-11-21) |

## פירוט

### #1 שלד Astro - Done
אפיון אושר (2026-11-21). נוצר מ-create-astro 5.3.2, תבנית minimal, עם `--no-git --no-ai`. הותקנו: astro ^7.4.13, tailwindcss + @tailwindcss/vite ^4.3.5, @astrojs/check ^0.9.12, typescript ^6.0.3. Node נדרש >=22.23.4 (מותקן 24.13.0). `git init -b main`.
נוסף: סקריפט `npm run check`; `.gitignore` חוסם `.env.*`; README קצר לריפו הציבורי; עמוד ריק `src/pages/index.astro` עם Tailwind.
בדיקה (2026-11-21): עבר. `npm run check` - 0 errors, 0 warnings, 0 hints; `npm run build` - עמוד 1; localhost:4321 עולה (נבדק בדפדפן המובנה: רקע #141b26, Tailwind פעיל, בלי שגיאות בקונסול). הטלמטריה של Astro כובתה במחשב שלו.

### #2 שלד האתר - Done
אפיון אושר (2026-11-21). החלטות: Rubik דרך Fonts API של Astro (fontsource, לטינית + עברית, בלי חבילה); ביקור ראשון תמיד כהה; מייל בתחתית `assaf@assafelad.com`; LinkedIn `https://www.linkedin.com/in/assafelad/`; itch.io `https://bussuf.itch.io`. עמודים זמניים ל-Music / Games / Apps / About עד צעדים 4-5. הקובייה מגרילה בינתיים עמוד זמני. בלי בדיקות אוטומטיות בצעד הזה (פריסה ואודיו).
בדיקה (2026-11-21): `check` נקי (15 קבצים), `build` נקי (5 עמודים, Rubik הועתק - 2 קבצים). הסאונד עובד אצלו. מעבר מהיר בין עמודים חיכה גם בלי סאונד - האנימציה של ClientRouter. **תוקן:** `transition:animate="none"` על `<html>` (ClientRouter נשאר בשביל התווים). אחרי התיקון: מעבר עמוד ב-50-85ms, וחמש לחיצות ברצף כל 150ms מגיעות לעמוד הנכון. נבדקו גם: בהיר נשמר במעבר עמוד, Rubik נטען, ב-375px ה-Hotbar מוצג והלשוניות מוסתרות, בלי גלילה לצדדים. נסגר על ידו (2026-11-21, commit 0006d55). תיקון אחרי הסגירה: קו ההדגשה בלשונית וה-Hotbar בצבע הדלת של הדף (היה בצבע הטקסט, כי `var(--color-door)` נפתר ב-:root).
מקור: v7. לשוניות בכותרת דביקה במחשב, Hotbar בטלפון. כהה כברירת מחדל ומתג בהיר שנזכר, בלי הבהוב. Rubik מקבצים בריפו. ClientRouter כדי שתווי הסרגל לא ייקטעו ושרצף היוקלילי יישמר בין עמודים. כללי הסאונד ב-CLAUDE.md. תחתית: "Built with Astro, coffee and too many hours of Factorio." עם Email, LinkedIn ו-itch.io. בדיקות ל-Vitest (רצף, טיימר) - הצעה נפרדת, חבילה חדשה.

### #3 עמוד הבית - TODO
לפני הצעד: לקרוא את האקסל דרך סקריפט קריאה בלבד שהוא מריץ. באנר: guitar / games / with code / too much RimWorld ("1,547 hours and counting. Send help."), 3 תמונות למילה, 5.2 שניות, Pause/Play ממשיך מאותה נקודה. דלתות Music / Play games / Apps, נקישת עץ (לא תו).

### #4 תוכן ופרויקטים - TODO
build נכשל על תוכן שגוי. Play now פותח `<dialog>` עם iframe; לבדוק לכל משחק אם itch.io / Unity Play מתירים הטמעה, ואם לא - קישור החוצה. ChessLord: Download (Windows) לדף הנחיתה. AI Capitalist: Android, In development.

### #5 About ויוקלילי - TODO
**שינוי מ-v7 (2026-11-21, החלטתו):** ב-Then/Now התמונה העדכנית (הבוגרת) היא ברירת המחדל, וריחוף, פוקוס או הקשה חושפים את תמונת הילדות. צליל הקסם עולה כשהילדות נחשפת, ויורד ברכות כשחוזרים.
נושאים: Music, Making games, Apps (רק highlights - נקבע כאן), AI talks, Excel and BI (AgriLab-PRO + Travian), Games I play ("I regret nothing.", Steam/Epic/Discord). הרמז ליוקלילי בנושא Music.

### #6 SEO ונגישות - TODO
`@astrojs/sitemap` מותקן כאן. סטטיסטיקות: פתוח, ברירת המחדל בלי.

### #7 ריפו ופריסה - TODO
ריפו ציבורי (gh). עד צעד 8 האתר ב-`/assafelad-site/`, ולכן `base` זמני.

### #8 DNS - TODO
לשנות רק A/CNAME ב-Site123, כדי שההפניה של `assaf@assafelad.com` לא תישבר. לא לבטל את Site123 לפני שהאתר החדש עולה.
