import React, { useState } from 'react';
import ReactDOM from 'react-dom';
//import { useRouter } from 'next/router';
import { API_SERVER } from '../src/constants';
import Slider from '../components/Slider';
import Cookies from 'universal-cookie';
//import UserMenu from '../components/UserMenu';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Ping from '../components/Ping';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
//import 'bootstrap/dist/css/bootstrap.min.css';
import "../src/styles.css";
const cookies = new Cookies();
const hash = cookies.get('hash');

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nextPage: '',
      divClass: 'cImage'
    };

    this.connectionAlive = this.connectionAlive.bind(this);
    this.hoverPhotoIn = this.hoverPhotoIn.bind(this);
    this.hoverPhotoOut = this.hoverPhotoOut.bind(this);
  }

  connectionAlive() {

  }
  hoverPhotoIn (e) {
    e.currentTarget.classList.add('cImageHovered');
  }
  hoverPhotoOut (e) {
    e.currentTarget.classList.remove('cImageHovered');
  }

  componentDidUpdate() {
  }
  componentDidMount() {
    console.log (window.location.pathname);
  }
  render() {
		return (
			<Container fluid>
      <Header />
        <Nav />
        <Ping />
        <div className="row">
          <div className="col-md-12 noPadding">
            <Slider />
          </div>
        </div>
        <div className="spacer50px" />
        <div className="row">
          <div className="col-md-12 ce capitalLetters">
            Your Loved Pieces
          </div>
        </div>
        <div className="spacer50px" />
        <div className="row">
          <div className="col-md-2" />
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-6 ce">
                <a href="/leya-wrap-dress"><div className={this.state.divClass} onMouseOver={this.hoverPhotoIn} onMouseOut={this.hoverPhotoOut}><img className="dyn" src={`${API_SERVER}productphotos/leya-wrap-dress-01.jpg`} alt="LEYA Wrap Dress" /><p>LEYA Wrap Dress <br /><span>€319</span></p></div></a>
                <div className="spacer25px" />
              </div>
              <div className="col-md-6 ce">
                <a href="/dalhia-blouse"><div className={this.state.divClass} onMouseOver={this.hoverPhotoIn} onMouseOut={this.hoverPhotoOut}><img className="dyn" src={`${API_SERVER}productphotos/dalhia-blouse-01.jpg`} alt="DALHIA Blouse" /><p>DALHIA Blouse <br /><span>€105</span></p></div></a>
                <div className="spacer25px" />
              </div>
            </div>
          </div>
          <div className="col-md-2" />
        </div>
        <div className="row">
          <div className="col-md-2" />
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-6 ce">
                <a href="/tuli-dress"><div className={this.state.divClass} onMouseOver={this.hoverPhotoIn} onMouseOut={this.hoverPhotoOut}><img className="dyn" src={`${API_SERVER}productphotos/tuli-dress-03.jpg`} alt="TULI Dress" /><p>TULI Dress <br /><span>€169</span></p></div></a>
                <div className="spacer25px" />
              </div>
              <div className="col-md-6 ce">
                <a href="/bella-hand-painted-blouse"><div className={this.state.divClass} onMouseOver={this.hoverPhotoIn} onMouseOut={this.hoverPhotoOut}><img className="dyn" src={`${API_SERVER}productphotos/bella-print-01.jpg`} alt="BELLA Hand Painted Blouse" /><p>BELLA Hand Painted Blouse <br /><span>€129</span></p></div></a>
                <div className="spacer25px" />
              </div>
            </div>
          </div>
          <div className="col-md-2" />
        </div>
        <div className="row">
          <div className="col-md-2" />
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-6 ce">
                <a href="/reeva-denim-jacket"><div className={this.state.divClass} onMouseOver={this.hoverPhotoIn} onMouseOut={this.hoverPhotoOut}><img className="dyn" src={`${API_SERVER}productphotos/reeva-denim-jacket-01.jpg`} alt="REEVA Denim Jacket" /><p>REEVA Denim Jacket <br /><span>€159</span></p></div></a>
                <div className="spacer25px" />
              </div>
              <div className="col-md-6 ce">
                <a href="/senna-skirt"><div className={this.state.divClass} onMouseOver={this.hoverPhotoIn} onMouseOut={this.hoverPhotoOut}><img className="dyn" src={`${API_SERVER}productphotos/senna-skirt-01.jpg`} alt="SENNA Skirt" /><p>SENNA Skirt <br /><span>€135</span></p></div></a>
                <div className="spacer25px" />
              </div>
            </div>
          </div>
          <div className="col-md-2" />
        </div>
        <Footer />
      </Container>
		);
	}
}
