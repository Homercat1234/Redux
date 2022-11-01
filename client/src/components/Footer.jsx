import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
function Footer() {
  return (
    <Container fluid className="bg-dark d-flex flex-column text-center text-white m-0 py-2 justify-content-center" style={{position: 'abolute', bottom: '0', width: '100%', height: '8.5rem' }}>
      <Row><small>&copy;Michael Smith 2022</small></Row>
      <Row><small>All rights reserved.</small></Row>
    </Container>
  );
}

export default Footer;