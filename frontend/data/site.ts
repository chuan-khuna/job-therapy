// Site-wide content configuration: hero, nav, footer.
// Edit copy here rather than in the components.

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  /** Brand / wordmark shown in the nav and footer */
  name: string;
  hero: {
    /** Small mono eyebrow above the headline */
    eyebrow: string;
    /** Headline lines — each entry renders on its own line */
    headline: string[];
    /** Supporting paragraph below the headline */
    subhead: string;
  };
  nav: {
    /** Wordmark link label (defaults to `name` when omitted) */
    brand: string;
    links: NavLink[];
  };
  footer: {
    links: NavLink[];
    /** Bottom-line attribution / copyright */
    note: string;
  };
}

export const site: SiteConfig = {
  name: "Job Therapy",

  hero: {
    eyebrow: "อิงจาก Job Therapy · Tessa West",
    headline: ["ค้นพบสัญญาณ", "ความไม่สอดคล้องในการทำงาน"],
    subhead:
      "แบบประเมินตนเองที่ช่วยให้คุณรู้จักตัวเองในมิติของการทำงาน ก่อนที่ปัญหาจะใหญ่เกินแก้",
  },

  nav: {
    brand: "Job Therapy",
    links: [{ label: "แบบประเมิน", href: "/" }],
  },

  footer: {
    links: [{ label: "แบบประเมิน", href: "/" }],
    note: "อิงจาก Job Therapy · Tessa West",
  },
};
