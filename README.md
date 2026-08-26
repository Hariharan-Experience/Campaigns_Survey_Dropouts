# Survey Dropout & Response Intelligence

**Name + Role:** Hariharan Jothi — Experience.com

**Problem I solved:** Researchers can see that a survey's completion rate
dropped, but pinpointing which question caused it and why means exporting raw
response data, pivoting it by question to find the drop-off, then reading
hundreds of open-text answers by hand to work out what respondents actually
struggled with — a half-day of manual work per campaign, and it usually
happens only after the campaign has already closed.

**What I built:** An AI tool that finds the exact question causing survey
dropout and rewrites it, by computing dropout and completion rates live from
response data, then sending the worst-performing question and real respondent
answers to Claude for reworded options and theme discovery — with no "worst
question" or theme list ever hard-coded; both are found from the data itself.

**Tool used:** Claude Code

**Time without AI:** ~7 hours per campaign, manually — roughly 4 hours
exporting and pivoting raw data to locate the drop-off point, then 3 hours
reading open-text responses to work out why.

**Time with AI today:** Under 5 minutes per campaign — the dropout table
computes on load, and both AI calls (question rewrite, theme discovery) return
in seconds once triggered.

**Will I use this next week?** YES — the dropout table and the
wording-suggestion loop apply directly to live XMP survey campaigns, where a
single badly worded question can quietly cost completion for the campaign's
entire run.

**Where does it live?** Branch [`Hariharan-survey-dropout-insights`](https://github.com/Experience-org/hackathon-aug26/tree/Hariharan-survey-dropout-insights)
