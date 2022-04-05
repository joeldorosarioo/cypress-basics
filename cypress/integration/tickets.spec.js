describe('Tickets', () => {
	let userDetails;

	beforeEach(() => {
		cy.visit('https://ticket-box.s3.eu-central-1.amazonaws.com/index.html');

		cy.fixture("user").then((user) => {
			userDetails = user;
		});
	});

	it("has 'TICKETBOX' header's heading", () => {
		cy.get('header h1').should('contain', 'TICKETBOX');
	});

	it('fills all the text input fields', () => {
		cy.get('#first-name').type(userDetails.first_name);
		cy.get('#last-name').type(userDetails.last_name);
		cy.get('#email').type(userDetails.email_address);
		cy.get('#requests').type(userDetails.request1);
		cy.get('#signature').type(userDetails.full_name);
	});

	it('select two tickets', () => {
		cy.get('#ticket-quantity').select('2');
	});

	it("select 'vip' ticket type", () => {
		cy.get('#vip').check();
	});

	it("selects 'social media' checkbox", () => {
		cy.get('#social-media').check();
	});

	it("selects 'friend' and 'publication', then uncheck 'friend'", () => {
		cy.get('#friend').check();
		cy.get('#publication').check();

		cy.get('#friend').uncheck();
	});

	it('alerts on invalid e-mail', () => {
		cy.get('#email')
			.as('email')
			.type(userDetails.invalid_email_address);

		cy.get('#email.invalid')
			.as('invalidEmail')
			.should('exist');

		cy.get('@email')
			.clear()
			.type(userDetails.email_address);

		cy.get('#email.invalid').should('not.exist');
	});

	it('fills and reset the form', () => {
		cy.get('#first-name').type(userDetails.first_name);
		cy.get('#last-name').type(userDetails.last_name);
		cy.get('#email').type(userDetails.email_address);

		cy.get('#ticket-quantity').select('2');
		cy.get('#vip').check();
		cy.get('#friend').check();
		cy.get('#requests').type(userDetails.request2);

		cy.get('.agreement p').should('contain', `I, ${ userDetails.full_name }, wish to buy 2 VIP tickets.`);

		cy.get('#agree').click();
		cy.get('#signature').type(userDetails.full_name);

		cy.get('button[type="submit"]')
			.as('submitButton')
			.should('not.be.disabled');

		cy.get('button[type="reset"]').click();

		cy.get('@submitButton').should('be.disabled');
	});

	it('fills mandatory fields using support command', () => {
		const customer = {
			first_name: userDetails.first_name,
			last_name: userDetails.last_name,
			email: userDetails.email_address,
		};

		cy.fillMandatoryFields(customer);

		cy.get('button[type="submit"]')
			.as('submitButton')
			.should('not.be.disabled');

		cy.get('#agree').uncheck();

		cy.get('@submitButton').should('be.disabled');
	});
});
