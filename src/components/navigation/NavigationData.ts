export const navLinks = [
    { name: 'Home', path: '/' },
    {
      name: 'Documents',
      dropdown: [
        { name: 'All Documents', path: '/documents' },
        { name: 'My CVs', path: '/documents/cvs' },
        { name: 'My Cover Letters', path: '/documents/cover-letters' },
        { name: 'My Portfolios', path: '/documents/portfolios' },
        { name: 'My Certificates', path: '/documents/certificates' },
      ],
    },
    {
      name: 'Create',
      dropdown: [
        { name: 'New CV', path: '/create/cv' },
        { name: 'New Cover Letter', path: '/create/cover-letter' },
        { name: 'New Portfolio', path: '/create/portfolio' },
        { name: 'New Certificate', path: '/create/certificate' },
      ],
    },
    { name: 'Templates', path: '/templates' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Help', path: '/help' },
  ];
  