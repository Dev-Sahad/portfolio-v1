export type SiteSettings = {
  owner_name: string
  hero_title_primary: string
  hero_title_secondary: string
  hero_role: string
  hero_description: string
  availability_text: string
  about_eyebrow: string
  about_title: string
  about_description: string
  about_quote: string
  cv_url: string
  github_url: string
  linkedin_url: string
  instagram_url: string
  youtube_url: string
  tiktok_url: string
  contact_heading: string
  contact_subheading: string
}

export const defaultSiteSettings: SiteSettings = {
  owner_name: 'Muhammad Sahad',
  hero_title_primary: 'Frontend',
  hero_title_secondary: 'Developer',
  hero_role: 'Junior Programmer',
  hero_description:
    'Creating modern websites with a clean, responsive, and elegant appearance. Transforming ideas and designs into engaging and user-friendly digital experiences.',
  availability_text: 'Available for work',
  about_eyebrow: 'ABOUT ME',
  about_title: 'Muhammad\nSahad',
  about_description:
    'Fresh graduate of SMK Software Engineering class of 2026 with a passion for front-end development and modern UI. Focused on creating clean, responsive, and user-friendly websites.',
  about_quote: 'Turning ideas into clean, modern, and meaningful digital experiences.',
  cv_url: '',
  github_url: 'https://github.com/Dev-Sahad',
  linkedin_url: 'https://www.linkedin.com/in/muhammad-sahad-78b827352',
  instagram_url: 'https://www.instagram.com/sahad_____sha/',
  youtube_url: 'https://www.youtube.com/@SAHAD-IS-LIVE',
  tiktok_url: 'https://www.tiktok.com/@sahad_____sha?_r=1&_t=ZS-975TzehiVhI',
  contact_heading: 'Contact Me',
  contact_subheading: "Have something in mind? Send a message and let's connect.",
}

export function mergeSiteSettings(settings?: Partial<SiteSettings> | null): SiteSettings {
  return {
    ...defaultSiteSettings,
    ...(settings || {}),
  }
}
