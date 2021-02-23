describe('Navigation', () => {
  beforeEach(() => {
    cy.request('GET', '/api/debug/reset');
    cy.visit('/');
    cy.contains('Monday');
  });

  it('should book interview', () => {
    cy.get('[alt=Add]').first().click();

    cy.get('[data-testid=student-name-input]').type('Lydia Miller Jones');

    cy.get("[alt='Sylvia Palmer']").click();
    cy.contains('Save').click();
    cy.contains('.appointment__card--show', 'Lydia Miller Jones');
    cy.contains('.appointment__card--show', 'Sylvia Palmer');
  });

  it('should edit interview', () => {
    cy.get('[alt=Edit]').first().click({ force: true });

    cy.get("[alt='Tori Malcolm']").click();

    cy.get('[data-testid=student-name-input]').clear().type('Brady Blair');

    cy.contains('Save').click();

    cy.contains('.appointment__card--show', 'Brady Blair');
    cy.contains('.appointment__card--show', 'Tori Malcolm');
  });

  it('should delete interview', () => {
    cy.get('[alt=Delete]').first().click({ force: true });

    cy.get('.button--danger').contains('Confirm').click();

    cy.contains('Deleting').should('exist');
    cy.contains('Deleting').should('not.exist');

    cy.contains('.appointment__card--show', 'Archie Cohen').should('not.exist');
  });
});
