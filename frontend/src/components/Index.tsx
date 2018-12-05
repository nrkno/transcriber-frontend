import React from "react"

const Index = () => {
  return (
    <main id="transcript">
      <h1>Velkommen til NRK transkribering beta!</h1>
      <p>
        Dette er et verktøy som konverterer tale til tekst via Google sitt API for tale til tekst. Vi er for tiden i <a href="https://confluence.nrk.no/display/~n636391/Hva+kan+man+forvente+av+en+alfa+eller+beta+release">beta</a>, noe som
        betyr at verktøyet er under utvikling. Det betyr også at man ikke kan forvente support, men må godta å bruke verktøyet slik det er pr. dags dato.
      </p>
      <p>
        Selv om verktøyet ikke konverterer med hundre prosent nøyaktighet fra tale til tekst på alle språk, så håper vi at resultatet kan være godt nok til at du kjapt kan orientere deg i ditt eget opptak på en effektiv måte. Du kan selv
        eksportere ut teksten til et Word-dokument og redigere i teksten som du ønsker der.
      </p>
      <p>Verktøyet støtter over 60 språk. Norsk språk fungerer opp mot 80%, mens engelsk opp mot 90%. Du kan laste opp alle type lydfiler, men husk at lydfilen bør være maks 200 MB, og maks lengde bør være under 1 time og 30 min.</p>
      <p>Lykke til !</p>

      <a href="/login">
        <button className="org-btn org-btn--primary login">Logg inn </button>
      </a>
    </main>
  )
}

export default Index
