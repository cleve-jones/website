const { page } = require('./build.js');

const icon = id => `<svg aria-hidden="true"><use href="#i-${id}"></use></svg>`;

/* ============================================================ HOME ===== */

const HERO_SHOTS = [
  ['act',      'The AIDS Memorial Quilt laid out on the National Mall in Washington, D.C., with the Washington Monument beyond.', 1280],
  ['speak',    'Cleve Jones marching in San Francisco at the head of a crowd carrying a long rainbow flag.', 1600],
  ['organize', 'A night-time march in San Francisco, candles raised, marchers carrying portraits of Harvey Milk and George Moscone.', 1920],
  ['create',   'The Parthenon of Books: a full-size temple built from banned books wrapped in plastic.', 1400],
  ['teach',    'Cleve Jones talking with a group of students in front of hanging AIDS Memorial Quilt panels.', 1920],
  ['unite',    'A large community mural showing the faces of many people of different ages and backgrounds.', 1920],
  ['heal',     'En Memoria: a COVID-19 memorial, portraits of those lost rising up a wall at sunset.', 1400],
  ['remember', 'A crowd at a candlelight vigil at night, each person holding a lit candle.', 1400]
];

const heroImgs = HERO_SHOTS.map(([name, alt, w], i) => `      <img class="hero-img${i === 0 ? ' is-active' : ''}"
           src="assets/img/hero-${name}.jpg"
           srcset="assets/img/hero-${name}-sm.jpg 800w, assets/img/hero-${name}.jpg ${w}w"
           sizes="100vw" alt="${alt}"
           ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>`).join('\n');

const heroDots = HERO_SHOTS.map((s, i) =>
`      <li><button type="button" aria-current="${i === 0 ? 'true' : 'false'}"><span class="sr-only">Show photograph ${i + 1} of 8</span></button></li>`).join('\n');

const PROGRAM_CARDS = `
      <article class="prog-card">
        <div class="prog-card-top prog-top-green">
          ${icon('brush')}
          <h3>Advocacy<br>through the Arts</h3>
        </div>
        <div class="prog-card-body">
          <p>Grants for young artists whose work moves people to act on civil rights, public health and economic justice.</p>
          <a class="tlink" href="our-work.html#arts">Learn more</a>
        </div>
      </article>
      <article class="prog-card">
        <div class="prog-card-top prog-top-plum">
          ${icon('people')}
          <h3>Intergenerational<br>Mentorship</h3>
        </div>
        <div class="prog-card-body">
          <p>Pairing young people with experienced leaders who help them build skills and have impact through their work.</p>
          <a class="tlink" href="our-work.html#mentorship">Learn more</a>
        </div>
      </article>
      <article class="prog-card">
        <div class="prog-card-top prog-top-blue">
          ${icon('quilt')}
          <h3>HIV/AIDS Education<br>&amp; Awareness</h3>
        </div>
        <div class="prog-card-body">
          <p>Supporting people and programs who advocate for an end to the epidemic.</p>
          <a class="tlink" href="our-work.html#hiv-aids">Learn more</a>
        </div>
      </article>`;

const EVENTS = [
  ['ev-red', 'Nov. 27', '2026', 'Reflection',    'Cleve remembers Harvey Milk',
   'On the anniversary of Harvey Milk&rsquo;s assassination, Cleve reflects on the mentor who believed in him first.'],
  ['ev-blue',       'Dec. 1',  '2026', 'World AIDS Day', 'Cleve Jones honored by the United Nations',
   'Recognized for his work on HIV and AIDS, on World AIDS Day.'],
];
/* Two 2027 dates — the first grants night and the Quilt's 40th — are held back
   until the Castro Theatre is confirmed. Add them to EVENTS to put them live. */

const eventCards = EVENTS.map(([cls, when, year, kind, title, body]) => `
      <article class="event">
        <div class="event-date ${cls}">
          <span class="d-when">${when}</span>
          <span class="d-year">${year}</span>
          <span class="d-kind">${kind}</span>
        </div>
        <div class="event-body">
          <h3>${title}</h3>
          <p>${body}</p>
        </div>
      </article>`).join('');

page('index.html',
  'Cleve Jones Foundation — Advocacy &amp; Art for Social Change',
  'For 50 years, Cleve Jones has built movements for change. His foundation gives young people the tools to carry that work forward.',
`
<section class="hero" id="hero" aria-label="Art moves people to act">
  <div class="hero-media">
${heroImgs}
  </div>
  <div class="hero-scrim" aria-hidden="true"></div>
  <svg class="hero-grain" aria-hidden="true" preserveAspectRatio="none">
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"/></filter>
    <rect width="100%" height="100%" filter="url(#grain)"/>
  </svg>

  <div class="wrap hero-inner">
    <p class="eyebrow eyebrow-on-dark">Advocacy &amp; Art for Social Change</p>
    <h1 class="hero-title">Art moves people to <span class="hero-verb" id="heroVerb">act.</span></h1>
    <p class="hero-lede">For 50 years, Cleve Jones has built movements for change. His foundation gives young people the tools to carry that work forward.</p>
    <div class="hero-actions">
      <a class="btn btn-primary btn-lg" href="give.html">${icon('bullhorn')} Become an Advocate</a>
      <a class="btn btn-on-dark btn-lg" href="our-work.html">See our work</a>
    </div>
    <p class="hero-caption">
      <span class="hero-tag" id="heroTag">Act</span>
      <span id="heroCap">Advocacy &middot; Art &middot; Mentorship &middot; HIV/AIDS</span>
    </p>
  </div>

  <div class="hero-squares" aria-hidden="true">
    <span class="sq sq-bullhorn is-lit">${icon('bullhorn')}</span>
    <span class="sq sq-brush is-lit">${icon('brush')}</span>
    <span class="sq sq-people is-lit">${icon('people')}</span>
    <span class="sq sq-quilt is-lit">${icon('quilt')}</span>
  </div>

  <ol class="hero-dots" aria-label="Choose a photograph">
${heroDots}
  </ol>
</section>

<section class="section section-ivory" aria-labelledby="work-title">
  <div class="wrap">
    <div class="section-head">
      <div>
        <p class="eyebrow">Our work</p>
        <h2 id="work-title">Three ways we help young people <span class="accent">make change.</span></h2>
      </div>
      <a class="tlink" href="our-work.html">Our work</a>
    </div>
    <div class="cards-3">${PROGRAM_CARDS}
    </div>
  </div>
</section>

<section class="section section-navy" aria-labelledby="addname">
  <div class="wrap">
    <div class="band-inner band-inner-top">
      <span class="band-mark mark-red" aria-hidden="true">${icon('bullhorn')}</span>
      <div class="stack-head">
        <p class="eyebrow eyebrow-on-dark">Be an advocate</p>
        <h2 id="addname">Add your name <span class="accent-on-dark">to our movement.</span></h2>
        <p class="lede">Support the Cleve Jones Foundation as we invest in the next generation and keep our movement alive. Change is built dollar by dollar, and every gift adds your name to ours.</p>
      </div>
    </div>
    <div class="give-grid" style="margin-top:2.6rem">
      <div class="give-col"><h4>Become an Advocate</h4><p>Our monthly givers are our Advocates. Start at $5.</p></div>
      <div class="give-col"><h4>Give once</h4><p>Any amount, any time.</p></div>
      <div class="give-col"><h4>Put your name on a program</h4><p>Back the arts, mentorship or HIV/AIDS education in your name.</p></div>
      <div class="give-col"><h4>Leave a legacy</h4><p>Include the foundation in your will or trust.</p></div>
      <div class="give-col"><h4>Sponsor an event</h4><p>Put your name in front of our community.</p></div>
    </div>
    <div class="actions-row">
      <a class="btn btn-accent" href="give.html">${icon('bullhorn')} Become an Advocate</a>
      <a class="btn btn-on-dark" href="give.html">${icon('bullhorn')} All ways to give</a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="about-cleve">
  <div class="wrap split split-narrow-left">
    <figure class="figure">
      <img src="assets/img/cleve-speaking.jpg" width="305" height="407"
           alt="Black and white photograph of Cleve Jones speaking into a microphone.">
      <figcaption>Cleve Jones speaking.</figcaption>
    </figure>
    <div>
      <p class="eyebrow">About Cleve</p>
      <h2 id="about-cleve">Keep pushing.<br>Keep fighting.<br><span class="accent">Keep organizing.</span></h2>
      <p>That&rsquo;s what Cleve Jones learned from his mentors, Harvey Milk and Art Agnos. He co-founded the San Francisco AIDS Foundation, founded the AIDS Memorial Quilt and spent two decades organizing for working families. Now he&rsquo;s sharing those lessons with young leaders.</p>
      <a class="tlink" href="about.html">Read Cleve&rsquo;s story</a>
    </div>
  </div>
</section>

<section class="section section-ivory" aria-labelledby="events-title">
  <div class="wrap">
    <div class="section-head">
      <h2 id="events-title">Events &amp; news</h2>
      <a class="tlink" href="events.html">See all</a>
    </div>
    <div class="event-grid">${eventCards}
    </div>
  </div>
</section>
`);

/* =========================================================== ABOUT ===== */

page('about.html',
  'About — Cleve Jones Foundation',
  'Fifty years of fighting for change, the mentors who believed in Cleve Jones, and why he is investing in young leaders now.',
`
<section class="interior-hero">
  <img src="assets/img/hero-act.jpg" alt="The AIDS Memorial Quilt laid out on the National Mall in Washington, D.C.">
  <div class="scrim" aria-hidden="true"></div>
  <div class="wrap inner">
    <p class="eyebrow eyebrow-on-dark">About</p>
    <h1>Fifty years of fighting for change. <span class="accent-on-dark">It&rsquo;s time to invest in our future leaders.</span></h1>
    <p>Cleve Jones has spent his life turning grief and anger into action. The Cleve Jones Foundation helps young people do the same.</p>
    <p class="credit">The AIDS Memorial Quilt on the National Mall, Washington, D.C.</p>
  </div>
</section>

<section class="section" aria-labelledby="names">
  <div class="wrap split split-narrow-right">
    <div>
      <p class="eyebrow">Cleve&rsquo;s story</p>
      <h2 id="names">It started <span class="accent">with names.</span></h2>
      <p>In November 1985, Cleve Jones was organizing the yearly candlelight march for Harvey Milk and George Moscone when he learned that more than 1,000 San Franciscans had been lost to AIDS.</p>
      <p>He asked marchers to write the names of friends and loved ones on placards. At the end of the march, Cleve and others climbed ladders and taped the names to the San Francisco Federal Building. The wall of names looked like a patchwork quilt.</p>
      <p>Cleve made the first panel in memory of his friend Marvin Feldman. A small group of strangers gathered in a San Francisco storefront to begin the memorial. On October 11, 1987, the AIDS Memorial Quilt was displayed on the National Mall for the first time, and the names of the people it honored were read aloud &mdash; a tradition that continues at Quilt displays today.</p>
      <p>He has never stopped organizing: for LGBTQ+ equality, for people living with HIV and for working families. &ldquo;The movement saved my life twice,&rdquo; he told NPR in 2016.</p>
    </div>
    <figure class="figure">
      <img src="assets/img/names-wall.jpg" width="560" height="700"
           alt="Black and white photograph of people taping handwritten placards of names to the wall of the San Francisco Federal Building.">
      <figcaption>The wall of names, San Francisco Federal Building, 1985.</figcaption>
    </figure>
  </div>
</section>

<section class="section section-ivory" aria-labelledby="their-turn">
  <div class="wrap">
    <p class="eyebrow">Why Cleve is creating the foundation</p>
    <h2 id="their-turn">Forty years ago, he started a movement. <span class="accent">Now it&rsquo;s their turn.</span></h2>
    <p class="lede" style="margin-bottom:2.6rem">Cleve learned from mentors who taught him to keep pushing, keep fighting and keep organizing. He is creating this foundation for young leaders who want to use artistic expression for social change.</p>
    <div class="mini-cols">
      <div class="mini-col">
        <span class="tile t-green" aria-hidden="true">${icon('brush')}</span>
        <h3>Support art for change</h3>
        <p>Fund young artists whose work moves people to act, the way the Quilt moved a nation.</p>
      </div>
      <div class="mini-col">
        <span class="tile t-plum" aria-hidden="true">${icon('people')}</span>
        <h3>Give young people the tools</h3>
        <p>Provide the mentors, training and resources young people need to have real impact.</p>
      </div>
      <div class="mini-col">
        <span class="tile t-blue" aria-hidden="true">${icon('quilt')}</span>
        <h3>Help end the epidemic</h3>
        <p>Support people and programs who advocate for an end to HIV/AIDS.</p>
      </div>
    </div>
    <div class="support-box">
      <span class="mark" aria-hidden="true">${icon('bullhorn')}</span>
      <div>
        <h3>We need your support as an advocate.</h3>
        <p>Every gift, at any amount, helps young people carry this work forward.</p>
      </div>
      <div class="actions">
        <a class="btn btn-accent" href="give.html">Become an Advocate</a>
        <a class="btn btn-on-dark" href="give.html">All ways to give</a>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="mentors">
  <div class="wrap">
    <p class="eyebrow">The mentors who shaped him</p>
    <h2 id="mentors" style="margin-bottom:2.4rem">Someone believed in him first.</h2>
    <div class="cols-2">
      <article>
        <figure class="figure figure-fill" style="margin-bottom:1.3rem">
          <img src="assets/img/mentor-milk.jpg" width="458" height="305"
               alt="Black and white photograph of a protest crowd holding placards reading &quot;Separate church and state&quot;, with Harvey Milk at right.">
          <figcaption>Cleve Jones, left, with Harvey Milk, right, 1970s.</figcaption>
        </figure>
        <h3>Harvey Milk</h3>
        <p>Cleve was new to San Francisco when Harvey Milk befriended him. While studying at San Francisco State, he worked as an intern in Milk&rsquo;s city office until Milk&rsquo;s assassination in 1978. Milk taught him to speak in plain language, find common ground and build coalitions with anyone.</p>
        <blockquote class="quote">
          &ldquo;Who saw value in me before any other person did, who loved me and raised me up.&rdquo;
          <cite>Cleve Jones, on Harvey Milk</cite>
        </blockquote>
      </article>
      <article>
        <figure class="figure figure-fill" style="margin-bottom:1.3rem">
          <img src="assets/img/mentor-agnos.jpg" width="620" height="413"
               alt="Art Agnos and Cleve Jones embracing on stage at the Light in the Grove gala.">
          <figcaption>Art Agnos and Cleve Jones at Light in the Grove.</figcaption>
        </figure>
        <h3>Art Agnos</h3>
        <p>Assemblyman Art Agnos met Cleve at City Hall a few weeks after Milk and Mayor George Moscone were killed. In 1981, he hired Cleve in his district office, when there were no openly gay legislators or staffers. Agnos opened the door to government for Cleve and was honest that the road ahead would be hard. He later became mayor of San Francisco.</p>
        <blockquote class="quote">
          &ldquo;Who belongs in the pantheon of heroic gay civil rights leaders.&rdquo;
          <cite>Art Agnos, on Cleve Jones</cite>
        </blockquote>
      </article>
    </div>
  </div>
</section>

<section class="section section-ivory" aria-labelledby="hear">
  <div class="wrap split">
    <figure class="figure">
      <img src="assets/img/exhibit.jpg" width="1200" height="800"
           alt="Cleve Jones speaking with visitors in a gallery hung with AIDS Memorial Quilt panels.">
      <figcaption>Cleve Jones with students at a Quilt exhibition.</figcaption>
    </figure>
    <div>
      <p class="eyebrow">Media &amp; resources</p>
      <h2 id="hear">Hear Cleve <span class="accent">tell the story.</span></h2>
      <p>Video, interviews, books and the Quilt online, all in one place.</p>
      <p><a class="btn btn-primary" href="media.html">See media &amp; resources</a></p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="founders">
  <div class="wrap">
    <p class="eyebrow">Founders</p>
    <h2 id="founders" style="margin-bottom:2.4rem">Who leads the foundation</h2>
    <div class="cards-3">
      <article class="founder">
        <div class="avatar"><img src="assets/img/cleve-portrait.jpg" width="400" height="400" alt="Portrait of Cleve Jones."></div>
        <h3>Cleve Jones</h3>
        <span class="role">Founder</span>
        <p>Sets the vision and serves as the public voice of the foundation.</p>
        <a class="tlink" href="bio-cleve.html">Read Cleve&rsquo;s bio</a>
      </article>
      <article class="founder founder-green">
        <div class="avatar" aria-hidden="true">BC</div>
        <h3>Brenden Chadwick</h3>
        <span class="role">Co-founder</span>
        <p>Leads day-to-day operations, strategy and vision for the foundation.</p>
        <a class="tlink" href="contact.html">Read Brenden&rsquo;s bio</a>
      </article>
      <article class="founder founder-blue">
        <div class="avatar" aria-hidden="true">KH</div>
        <h3>Kevin Herglotz</h3>
        <span class="role">Co-founder</span>
        <p>Leads development, communications and strategy for the foundation.</p>
        <a class="tlink" href="contact.html">Read Kevin&rsquo;s bio</a>
      </article>
    </div>
    <p class="footnote">The Cleve Jones Foundation is a fiscally sponsored project of the San Francisco Study Center, a 501(c)(3) nonprofit.</p>
  </div>
</section>
`);

/* ======================================================== OUR WORK ===== */

page('our-work.html',
  'Our Work — Cleve Jones Foundation',
  'Advocacy through the Arts, Intergenerational Mentorship, and HIV/AIDS Education & Awareness.',
`
<section class="wrap page-head">
  <div class="split split-narrow-right" style="align-items:center">
    <div>
      <p class="eyebrow">Our work</p>
      <h1>Three ways we help young people <span class="accent">make change.</span></h1>
      <p class="lede">For 50 years, Cleve Jones has built movements for change. These programs give young people the tools to follow in that work.</p>
    </div>
    <div class="trio" aria-hidden="true">
      <span class="tile t-green">${icon('brush')}</span>
      <span class="tile t-plum">${icon('people')}</span>
      <span class="tile t-blue">${icon('quilt')}</span>
    </div>
  </div>
</section>

<section class="work-block section-ivory" id="arts">
  <div class="wrap split">
    <div class="work-tile wt-green" aria-hidden="true">${icon('brush')}</div>
    <div>
      <h2>Advocacy<br>through the Arts</h2>
      <p>Grants for young artists using their work for social change: writers, filmmakers, painters, performers and community arts projects that move people to act. Our first grants go to young LGBTQ+ writers in 2027.</p>
      <p><a class="btn btn-primary" href="give.html">Support this program</a></p>
    </div>
  </div>
</section>

<section class="work-block" id="mentorship">
  <div class="wrap split split-reverse">
    <div class="work-tile wt-plum" aria-hidden="true">${icon('people')}</div>
    <div>
      <h2>Intergenerational Mentorship</h2>
      <p>Cleve had Harvey Milk and Art Agnos. Our mentorship programs pair young people with experienced leaders who help them have impact through their work, with practical help in organizing, storytelling, fundraising and media.</p>
      <p><a class="btn btn-primary" href="give.html">Support this program</a></p>
    </div>
  </div>
</section>

<section class="work-block section-ivory" id="hiv-aids">
  <div class="wrap split">
    <div class="work-tile wt-blue" aria-hidden="true">${icon('quilt')}</div>
    <div>
      <h2>HIV/AIDS Education &amp; Awareness</h2>
      <p>The foundation supports people and programs who advocate for an end to the epidemic.</p>
      <p><a class="btn btn-primary" href="give.html">Support this program</a></p>
      <div class="work-links">
        <span>Learn about the Quilt: <a href="https://www.aidsmemorial.org/quilt" rel="noopener">aidsmemorial.org/quilt</a></span>
        <span>See every name on the Quilt: <a href="https://www.aidsmemorial.org/interactive-aids-quilt" rel="noopener">Interactive AIDS Quilt</a></span>
      </div>
    </div>
  </div>
</section>

<section class="bigquote">
  <div class="wrap">
    <blockquote>
      <span class="mark" aria-hidden="true">&ldquo;</span>
      <p>You gotta give &rsquo;em hope.</p>
      <cite>Harvey Milk, Cleve&rsquo;s mentor</cite>
    </blockquote>
  </div>
</section>
`);

/* ============================================================ GIVE ===== */

/* Three cards for the ways most people give. Everything else is one plain
   list: nine identical boxes read as a wall, and the gifts that need a phone
   call or a form are better as a line each than as nine equal shouts. */
const GIVE_WAYS = [
  ['card-navy', 'Become an Advocate',
   'Give monthly and join our Advocates, the most powerful way to help. Monthly gifts let us plan grants and mentorships a year ahead. Start at $5, or give $40 a month in honor of 40 years of the Quilt.',
   '#donation-widget', 'Become an Advocate'],
  ['card-outline ct-red', 'Make a one-time gift',
   'Any amount, any time. Every gift supports young artists and leaders and the work to end the epidemic.',
   '#donation-widget', 'Give once'],
  ['card-outline ct-plum', 'Give in someone&rsquo;s name',
   'Honor a friend, a mentor or someone you lost, and we&rsquo;ll send a note to the person you name. Or put a name on a program &mdash; Advocacy through the Arts, Mentorship or HIV/AIDS Education &mdash; alongside its other supporters.',
   'contact.html', 'Give in someone&rsquo;s name']
];

const giveCards = GIVE_WAYS.map(([cls, t, b, href, link]) => `
      <article class="card ${cls}">
        <h3>${t}</h3>
        <p>${b}</p>
        <p><a class="tlink" href="${href}">${link}</a></p>
      </article>`).join('');

const GIVE_MORE = [
  ['Through your employer', 'Many employers match what their staff give, and some double it. Ask your human resources team, then tell us and we will do the paperwork.'],
  ['Stock, an IRA or a donor-advised fund', 'Give appreciated stock, a distribution from your IRA, or a grant from your donor-advised fund. We will send the transfer details.'],
  ['By check', 'Mail a check to our fiscal sponsor, the San Francisco Study Center, with &ldquo;Cleve Jones Foundation&rdquo; in the memo.'],
  ['In your will or trust', 'Include the foundation in your will, trust or retirement plan, and keep the movement going for the next generation.'],
  ['As an event sponsor', 'Back a gathering and put your name in front of our community. Companies and foundations are welcome.']
];

const giveMore = GIVE_MORE.map(([t, b]) =>
  `      <div><dt>${t}</dt><dd>${b}</dd></div>`).join('\n');

const FAQ = [
  ['Is my gift tax-deductible?', 'Yes, as allowed by law. The Cleve Jones Foundation is a fiscally sponsored project of the San Francisco Study Center, a 501(c)(3) nonprofit.'],
  ['Who processes my gift?', 'The San Francisco Study Center, our fiscal sponsor, receives and receipts every gift.'],
  ['Can I change or cancel a monthly gift?', 'Yes, anytime. Update your amount or cancel with one email.'],
  ['Will my name be public?', 'Only if you choose. You decide whether your name appears with a program.'],
  ['Can my company or foundation give?', 'Yes. We welcome event sponsors and grants. Contact us and we&rsquo;ll follow up.'],
  ['How will I know what my gift did?', 'Every year, you get a clear account of what we raised, what we spent and what we learned.']
];

page('give.html',
  'Give — Cleve Jones Foundation',
  'Be an advocate. Join the movement. Change is built dollar by dollar, by grassroots work and everyday people.',
`
<section class="section section-navy">
  <div class="wrap split" style="align-items:start">
    <div>
      <span class="band-mark mark-red" aria-hidden="true" style="margin-bottom:1.4rem">${icon('bullhorn')}</span>
      <p class="eyebrow eyebrow-on-dark">Give</p>
      <h1>Be an advocate. <span class="accent-on-dark">Join the movement.</span></h1>
      <p class="lede">Change is built dollar by dollar, by grassroots work and everyday people. When many people give a little, the impact is extraordinary. We need your support.</p>
      <div class="give-grid give-grid-3" style="margin-top:2.4rem">
        <div class="give-col" style="border-top-color:var(--green)"><h4>Advocacy through the Arts</h4><p>Funds young artists using art for change.</p></div>
        <div class="give-col" style="border-top-color:var(--plum)"><h4>Mentorship</h4><p>Connects young people with experienced leaders.</p></div>
        <div class="give-col" style="border-top-color:var(--blue)"><h4>HIV/AIDS Education</h4><p>Supports people and programs working to end the epidemic.</p></div>
      </div>
    </div>

    <!-- =====================================================================
         PLACEHOLDER DONATION FORM.
         The live form is supplied by the fiscal sponsor (San Francisco Study
         Center). Replace this entire <div id="donation-widget"> element with
         their embed code. Nothing else on the page depends on it.
         ===================================================================== -->
    <div class="donate-card" id="donation-widget">
      <h2>Make your gift</h2>
      <div class="toggle" role="group" aria-label="Giving frequency">
        <button type="button" data-freq="every month" aria-pressed="true">Monthly</button>
        <button type="button" data-freq="today" aria-pressed="false">One time</button>
      </div>
      <div class="amounts" role="group" aria-label="Amount">
        <button type="button" data-amount="5" aria-pressed="false">$5</button>
        <button type="button" data-amount="10" aria-pressed="false">$10</button>
        <button type="button" data-amount="25" aria-pressed="false">$25</button>
        <button type="button" data-amount="40" aria-pressed="true">$40</button>
        <button type="button" data-amount="100" aria-pressed="false">$100</button>
        <button type="button" data-amount="Other" aria-pressed="false">Other</button>
      </div>
      <p class="donate-note">$40 honors 40 years of the AIDS Memorial Quilt. Any amount works.</p>
      <form data-stub="This is a placeholder. The live donation form comes from the San Francisco Study Center." novalidate>
        <div class="field">
          <label for="designation">Where should it go?</label>
          <select id="designation" name="designation">
            <option>Where it&rsquo;s needed most</option>
            <option>Advocacy through the Arts</option>
            <option>Intergenerational Mentorship</option>
            <option>HIV/AIDS Education &amp; Awareness</option>
          </select>
        </div>
        <div class="field">
          <label for="tribute">In honor or memory of (optional)</label>
          <input id="tribute" name="tribute" type="text">
        </div>
        <div class="field-row">
          <div class="field"><label for="give-name">Name</label><input id="give-name" name="name" type="text" autocomplete="name"></div>
          <div class="field"><label for="give-email">Email</label><input id="give-email" name="email" type="email" autocomplete="email"></div>
        </div>
        <button class="btn btn-primary btn-block btn-lg" type="submit" id="donateCta">Give $40 every month</button>
        <p class="form-status donate-foot" role="status" hidden></p>
      </form>
      <p class="donate-foot">Secure checkout. Cancel anytime. Gifts go to the San Francisco Study Center, the Cleve Jones Foundation&rsquo;s fiscal sponsor.</p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="ways">
  <div class="wrap">
    <p class="eyebrow">How you can support</p>
    <h2 id="ways" style="margin-bottom:2.4rem">Every way <span class="accent">to give.</span></h2>
    <div class="cards-3">${giveCards}
    </div>
    <p class="eyebrow" style="margin-top:clamp(40px,5vw,64px)">Other ways to give</p>
    <dl class="waylist">
${giveMore}
    </dl>
    <p class="footnote" style="margin-top:1.6rem">Any of these, we will walk you through &mdash; email <a href="mailto:info@clevejones.com">info@clevejones.com</a>.</p>
  </div>
</section>

<section class="section section-ivory" aria-labelledby="faq">
  <div class="wrap">
    <p class="eyebrow">Questions</p>
    <h2 id="faq" style="margin-bottom:2.4rem">Giving, <span class="accent">answered.</span></h2>
    <div class="cols-2 faq">
${FAQ.map(([q, a]) => `      <div><h3>${q}</h3><p>${a}</p></div>`).join('\n')}
    </div>
  </div>
</section>
`);

/* =========================================================== MEDIA ===== */

/* Watch panel.
   mode 'youtube' plays in the page — paste the id into `yt` and it works.
   mode 'link'    opens the official page, for sources that cannot be embedded.
   mode 'pending' is the not-yet-recorded state. */
const VIDEOS = [
  {
    cls: 'ct-red', kicker: 'History &middot; Featured video',
    title: 'How the AIDS Memorial Quilt Became the Largest Community Art Project',
    mode: 'link', href: 'https://www.history.com/articles/aids-memorial-quilt', host: 'history.com'
  },
  {
    cls: 'ct-blue', kicker: 'YouTube &middot; Video',
    title: 'More from Cleve Jones',
    mode: 'youtube', yt: '', src: 'Add a YouTube ID to enable'
  },
  {
    cls: 'ct-green', kicker: 'BBC &middot; Video',
    title: 'The &lsquo;AIDS Quilt&rsquo; that showed the scale of suffering',
    mode: 'link', href: 'https://www.bbc.com/news/av/stories-51969409', host: 'bbc.com'
  },
  {
    cls: 'ct-plum', kicker: 'Reflection',
    title: 'Cleve remembers Harvey Milk',
    mode: 'pending', src: 'Recording to come'
  }
];

function videoCard(v) {
  const face = `<span class="face"><span class="play" aria-hidden="true">${icon('play')}</span>` +
               (v.src ? `<span class="src">${v.src}</span>` : '') + `</span>`;

  let media, note = '';
  if (v.mode === 'youtube') {
    // Paste the YouTube video id between the quotes to make this card play in page.
    media = `<button class="video-thumb" type="button" data-youtube="${v.yt}" data-title="${v.title.replace(/&[a-z]+;/g, '')}">${face}</button>`;
  } else if (v.mode === 'link') {
    media = `<a class="video-thumb" href="${v.href}" target="_blank" rel="noopener">${face}</a>`;
    note = `<span class="external">${icon('external')} Watch on ${v.host}</span>`;
  } else {
    media = `<span class="video-thumb" data-state="pending">${face}</span>`;
  }

  return `      <article class="video-card ${v.cls}">
        ${media}
        <div class="meta">
          <span class="kicker">${v.kicker}</span>
          <h3>${v.title}</h3>
          ${note}
        </div>
      </article>`;
}

/* The Watch section is off the site until there are real videos to show.
   VIDEOS and videoCard() above are untouched and the player still ships in
   site.js, so restoring it means pasting this block back into media.html's
   markup, directly above the "Listen and read" section:

<section class="section section-ivory" aria-labelledby="watch">
  <div class="wrap">
    <p class="eyebrow">Video</p>
    <h2 id="watch" style="margin-bottom:2.2rem">Watch</h2>
    <div class="cards-2">
${VIDEOS.map(videoCard).join(String.fromCharCode(10))}
    </div>
  </div>
</section>
*/
page('media.html',
  'Media &amp; Resources — Cleve Jones Foundation',
  'Video, interviews and reading on Cleve Jones, the AIDS Memorial Quilt and the movements behind them.',
`
<section class="wrap page-head">
  <p class="eyebrow">Media &amp; resources</p>
  <h1>Hear the story. <span class="accent">See the Quilt.</span></h1>
  <p class="lede">Interviews, books and the Quilt online: Cleve Jones, the AIDS Memorial Quilt and the movements behind them.</p>
</section>

<section class="section" aria-labelledby="listen">
  <div class="wrap">
    <p class="eyebrow">Interviews and books</p>
    <h2 id="listen" style="margin-bottom:2.2rem">Listen <span class="accent">and read.</span></h2>
    <div class="cards-3">
      <article class="card card-ivory ct-red">
        <span class="card-tile t-red" aria-hidden="true">${icon('audio')}</span>
        <h3>Fresh Air, NPR</h3>
        <span class="kickerlabel">NPR interview</span>
        <p>Cleve Jones talks with Terry Gross about his memoir, <em>When We Rise</em>.</p>
        <p><a class="tlink" href="contact.html">Listen</a></p>
      </article>
      <article class="card card-ivory ct-green">
        <span class="card-tile t-green" aria-hidden="true">${icon('video')}</span>
        <h3>Robin Roberts</h3>
        <span class="kickerlabel">ABC News interview</span>
        <p>Cleve Jones talks with Robin Roberts about the Quilt and his life in the movement.</p>
        <p><a class="tlink" href="contact.html">Watch</a></p>
      </article>
      <article class="card card-ivory ct-plum">
        <span class="card-tile t-plum" aria-hidden="true">${icon('book')}</span>
        <h3>Cleve&rsquo;s books</h3>
        <span class="kickerlabel">Books</span>
        <p><em>Stitching a Revolution</em> and <em>When We Rise: My Life in the Movement</em>.</p>
        <p><a class="tlink" href="contact.html">Find the books</a></p>
      </article>
    </div>
  </div>
</section>

<section class="work-block section-navy" aria-labelledby="explore">
  <div class="wrap split">
    <div class="work-tile wt-blue" aria-hidden="true">${icon('quilt')}</div>
    <div>
      <p class="eyebrow eyebrow-on-dark">The Quilt</p>
      <h2 id="explore">Explore <span class="accent-on-dark">the Quilt.</span></h2>
      <p>The AIDS Memorial Quilt is cared for by the National AIDS Memorial. Its history, how to see it in person, and every panel ever made, online.</p>
      <div class="work-links">
        <span>The Quilt today: <a href="https://www.aidsmemorial.org/quilt" rel="noopener">aidsmemorial.org/quilt</a></span>
        <span>See every name: <a href="https://www.aidsmemorial.org/interactive-aids-quilt" rel="noopener">the interactive Quilt</a></span>
        <span>Cleve on the Quilt, in his own words: <a href="contact.html">watch and listen</a></span>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="press">
  <div class="wrap">
    <h2 id="press" class="sr-only">Press and speaking</h2>
    <div class="support-box" style="margin-top:0">
      <span class="mark" aria-hidden="true">${icon('bullhorn')}</span>
      <div>
        <h3>Press kit, interviews and speaking requests</h3>
        <p>Fact sheet, <a href="bio-cleve.html">Cleve&rsquo;s bio</a>, approved photographs and logo files &mdash; and how to reach us for an interview or to invite Cleve to speak.</p>
      </div>
      <div class="actions">
        <a class="btn btn-accent" href="contact.html">Press &amp; speaking</a>
      </div>
    </div>
  </div>
</section>
`);

/* ========================================================== EVENTS ===== */

page('events.html',
  'Events &amp; News — Cleve Jones Foundation',
  'What is coming up for the Cleve Jones Foundation, from the Harvey Milk reflection to the 40th anniversary of the AIDS Memorial Quilt.',
`
<section class="wrap page-head">
  <p class="eyebrow">Events &amp; news</p>
  <h1>What&rsquo;s <span class="accent">coming up.</span></h1>
</section>

<section class="section section-ivory" style="padding-top:clamp(32px,4vw,52px)">
  <div class="wrap">
    <div class="event-list">${eventCards}
    </div>
    <p class="lede" style="margin-top:2.2rem">More is being planned for 2027, including the first grants night and the Quilt&rsquo;s 40th anniversary. Dates go up here as they are confirmed.</p>
    <p class="footnote" style="margin-top:1.6rem"><strong>Media inquiries:</strong> <a href="mailto:press@clevejones.com">press@clevejones.com</a></p>
  </div>
</section>
`);

/* ========================================================= CONTACT ===== */

page('contact.html',
  'Contact — Cleve Jones Foundation',
  'Artists, mentors, partners, press and event organizers: we want to hear from you.',
`
<section class="section">
  <div class="wrap split" style="align-items:start">
    <div>
      <p class="eyebrow">Contact</p>
      <h1>Let&rsquo;s build this <span class="accent">together.</span></h1>
      <p class="lede">Artists, mentors, partners, press and event organizers: we want to hear from you.</p>
      <h2 class="eyebrow" style="margin-top:2.4rem" id="follow-us">Follow @clevejones</h2>
      <div class="socials socials-dark" role="list" aria-labelledby="follow-us">
        <a role="listitem" href="https://instagram.com/clevejones" rel="me noopener">${icon('instagram')}<span class="sr-only">Instagram</span></a>
        <a role="listitem" href="https://facebook.com/clevejones" rel="me noopener">${icon('facebook')}<span class="sr-only">Facebook</span></a>
        <a role="listitem" href="https://linkedin.com/company/clevejones" rel="me noopener">${icon('linkedin')}<span class="sr-only">LinkedIn</span></a>
        <a role="listitem" href="https://threads.net/@clevejones" rel="me noopener">${icon('threads')}<span class="sr-only">Threads</span></a>
        <a role="listitem" href="https://tiktok.com/@clevejones" rel="me noopener">${icon('tiktok')}<span class="sr-only">TikTok</span></a>
        <a role="listitem" href="https://youtube.com/@clevejones" rel="me noopener">${icon('youtube')}<span class="sr-only">YouTube</span></a>
        <a role="listitem" href="https://x.com/clevejones" rel="me noopener">${icon('x')}<span class="sr-only">X</span></a>
      </div>
    </div>

    <div class="form-card">
      <h2>Send us a note</h2>
      <form data-stub="Thanks. The form is not connected to an inbox yet — please email info@clevejones.com in the meantime." novalidate>
        <div class="field-row">
          <div class="field"><label for="c-name">Name</label><input id="c-name" name="name" type="text" autocomplete="name" required></div>
          <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
        </div>
        <div class="field">
          <label for="c-topic">I&rsquo;m reaching out about</label>
          <select id="c-topic" name="topic">
            <option>General</option><option>Media</option><option>Speaking</option>
            <option>Giving</option><option>Programs</option>
          </select>
        </div>
        <div class="field">
          <label for="c-message">Message</label>
          <textarea id="c-message" name="message" required></textarea>
        </div>
        <button class="btn btn-primary" type="submit">Send</button>
        <p class="form-status donate-foot" role="status" hidden></p>
      </form>
    </div>
  </div>
</section>

<section class="section section-ivory">
  <div class="wrap">
    <div class="contact-strip">
      <article class="card ct-red">
        <h3>Media inquiries</h3>
        <p>Interviews, press materials and photos of Cleve and the foundation.</p>
        <a class="email" href="mailto:press@clevejones.com">press@clevejones.com</a>
        <a class="tlink" href="media.html">Download the press kit</a>
      </article>
      <article class="card ct-plum">
        <h3>Speaking engagements</h3>
        <p>Invite Cleve to speak at your campus, conference or community event.</p>
        <a class="email" href="mailto:speaking@clevejones.com">speaking@clevejones.com</a>
        <a class="tlink" href="mailto:speaking@clevejones.com">Request Cleve as a speaker</a>
      </article>
      <article class="card ct-blue">
        <h3>General</h3>
        <p>Programs, partnerships and everything else.</p>
        <a class="email" href="mailto:info@clevejones.com">info@clevejones.com</a>
        <p style="font-size:.9rem">San Francisco, California</p>
      </article>
    </div>
    <p class="footnote" style="margin-top:2rem">The Cleve Jones Foundation is a fiscally sponsored project of the San Francisco Study Center, a 501(c)(3) nonprofit. Gifts are tax-deductible as allowed by law.</p>
  </div>
</section>
`);


/* ====================================================== CLEVE'S BIO ===== */
/* A sub-page of About: not in the primary nav, so it passes nav:'about.html'
   to light About in the header, and its own og:image. */

page('bio-cleve.html',
  'Cleve Jones — Biography — Cleve Jones Foundation',
  'Human rights advocate, author and lecturer. Cleve Jones founded the AIDS Memorial Quilt, co-founded the San Francisco AIDS Foundation and has organized for more than five decades.',
`
<section class="interior-hero">
  <img src="assets/img/hero-speak.jpg"
       srcset="assets/img/hero-speak-sm.jpg 800w, assets/img/hero-speak.jpg 1600w"
       sizes="100vw"
       alt="Cleve Jones marching in San Francisco at the head of a crowd carrying a long rainbow flag.">
  <div class="scrim" aria-hidden="true"></div>
  <div class="wrap inner">
    <p class="eyebrow eyebrow-on-dark">Biography</p>
    <h1>Cleve Jones</h1>
    <p class="lede">Human Rights Advocate, Author and Lecturer</p>
    <p class="credit">Cleve Jones marching in San Francisco.</p>
  </div>
</section>

<section class="section" aria-labelledby="bio">
  <div class="wrap split split-narrow-right">
    <div>
      <h2 id="bio" class="sr-only">Biography</h2>
      <p class="lede">Cleve Jones is a human rights advocate, author and lecturer whose work spans more than five decades. He joined the gay liberation movement as a young man and was mentored by pioneer LGBTQ+ activist Harvey Milk and Art Agnos, the California Assemblymember who later became San Francisco mayor. Named a White House Champion of Change by President Barack Obama, Jones has given a voice to the voiceless, organized the struggling and the disenfranchised, and inspired generations by driving history-making change.</p>
      <p>During the darkest days of the AIDS pandemic, Jones co-founded the San Francisco AIDS Foundation and founded The NAMES Project AIDS Memorial Quilt in 1987, sparking an international movement demanding that governments act on HIV/AIDS. As the AIDS Quilt marks 40 years since its first display on the National Mall in Washington, DC, it remains the largest community arts project in the world.</p>
      <p>Jones was the historical consultant on Gus Van Sant&rsquo;s Oscar-winning film <cite>Milk</cite>, led the 2009 National Equality March and served on the Advisory Board of the American Foundation for Equal Rights, which challenged California&rsquo;s Proposition 8 in the U.S. Supreme Court. He is the author of <cite>Stitching a Revolution</cite> and the memoir <cite>When We Rise: My Life in the Movement</cite>, which inspired an ABC miniseries.</p>
      <p>Jones continues to organize, serving as a senior advisor to UNITE HERE International Union. In 2026, he spearheaded Seven Days in June, a national week of action in response to devastating U.S. cuts to healthcare and HIV/AIDS funding worldwide. His work also includes supporting the next generation of leaders who use artistic expression for social change, public health and civil rights through the Cleve Jones Foundation.</p>
      <p class="actions-row"><a class="tlink" href="about.html">Back to About</a></p>
    </div>
    <figure class="figure">
      <img src="assets/img/cleve-speaking.jpg" width="305" height="407"
           alt="Black and white photograph of Cleve Jones speaking into a microphone.">
      <figcaption>Cleve Jones speaking.</figcaption>
    </figure>
  </div>
</section>

<section class="section section-ivory" aria-labelledby="glance">
  <div class="wrap">
    <p class="eyebrow">At a glance</p>
    <h2 id="glance" style="margin-bottom:2rem">Five decades, in short.</h2>
    <dl class="glance">
      <div>
        <dt>Founder</dt>
        <dd>The NAMES Project AIDS Memorial Quilt, 1987 &mdash; still the largest community arts project in the world.</dd>
      </div>
      <div>
        <dt>Co-founder</dt>
        <dd>San Francisco AIDS Foundation.</dd>
      </div>
      <div>
        <dt>Mentors</dt>
        <dd>Harvey Milk, and Art Agnos, the California Assemblymember who later became San Francisco mayor.</dd>
      </div>
      <div>
        <dt>Recognition</dt>
        <dd>Named a White House Champion of Change by President Barack Obama.</dd>
      </div>
      <div>
        <dt>Books</dt>
        <dd><cite>Stitching a Revolution</cite> and the memoir <cite>When We Rise: My Life in the Movement</cite>, which inspired an ABC miniseries.</dd>
      </div>
      <div>
        <dt>Film</dt>
        <dd>Historical consultant on <cite>Milk</cite>, Gus Van Sant&rsquo;s Oscar-winning film.</dd>
      </div>
      <div>
        <dt>Campaigns</dt>
        <dd>Led the 2009 National Equality March; served on the Advisory Board of the American Foundation for Equal Rights, which challenged Proposition 8 in the U.S. Supreme Court; spearheaded Seven Days in June in 2026.</dd>
      </div>
      <div>
        <dt>Today</dt>
        <dd>Senior advisor to UNITE HERE International Union, and founder of the Cleve Jones Foundation.</dd>
      </div>
    </dl>
  </div>
</section>

<section class="section" aria-labelledby="bio-press">
  <div class="wrap">
    <h2 id="bio-press" class="sr-only">Press and speaking</h2>
    <div class="support-box" style="margin-top:0">
      <span class="mark" aria-hidden="true"><svg aria-hidden="true"><use href="#i-bullhorn"></use></svg></span>
      <div>
        <h3>Need this bio for a program or a press release?</h3>
        <p>The press kit has the fact sheet, approved photographs and logo files &mdash; and how to invite Cleve to speak.</p>
      </div>
      <div class="actions">
        <a class="btn btn-accent" href="contact.html">Press &amp; speaking</a>
        <a class="btn btn-on-dark" href="media.html">Media &amp; resources</a>
      </div>
    </div>
  </div>
</section>
`,
  { og: 'assets/img/hero-speak.jpg', nav: 'about.html' });
