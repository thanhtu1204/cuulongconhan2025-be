describe('Seo metadata', () => {
  describe('Verify SEO Metadata', () => {
    it('should render SEO metadata on Dashboard page', () => {
      cy.visit('/');

      // The Dashboard page should have a page title
      cy.title().should('not.be.empty');

      // The Dashboard page should also contain a meta description for SEO
      cy.get('head meta[name="description"]').invoke('attr', 'content').should('not.be.empty');
    });

    it('should render SEO metadata on About page', () => {
      cy.visit('/about');

      // The About page should have a page title
      cy.title().should('not.be.empty');

      // The About page should also contain a meta description for SEO
      cy.get('head meta[name="description"]').invoke('attr', 'content').should('not.be.empty');
    });
  });
});
