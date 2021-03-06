import React, { Component } from 'react';

import './admin.scss';
import { AdminProps, AdminState } from './admin.types';
import Pagination from '../Pagination/pagination';
import Axios from 'axios';

class Admin extends Component<AdminProps, AdminState> {
    state = {
        currentRequestors: [],
        currentRequestPage: 1,
        totalRequestPages: 1,
        currentDonators: [],
        currentDonationPage: 1,
        totalDonationPages: 1,
        show: false,
    };

    constructor(props: Readonly<AdminProps>) {
        super(props);
        this.getRequesters = this.getRequesters.bind(this);
        this.getDonators = this.getDonators.bind(this);
    }

    acceptRequest(e: any, index: number, id: string) {
        e.preventDefault();

        const { token } = this.props;

        Axios.patch<Array<Object>>(
            `http://localhost:3001/v1/request/${id}`,
            {
                status: 'Approved',
            },
            {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`,
                },
            },
        ).then(_response => {
            this.props.requests.splice(index, 0);
        });
    }

    declineRequest(e: any, index: number, id: string) {
        e.preventDefault();

        const { token } = this.props;

        Axios.patch<Array<Object>>(
            `http://localhost:3001/v1/request/${id}`,
            {
                status: 'Declined',
            },
            {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`,
                },
            },
        ).then(_response => {
            this.props.requests.splice(index, 0);
        });
    }

    thankYouConfirmation(e: any) {
        console.log(e);
    }

    socialMediaPromotion(e: any) {
        console.log(e);
    }

    getRequesters() {
        let requesters: Array<JSX.Element> = [],
            { currentRequestors } = this.state;

        currentRequestors.forEach((element: any, index: number) => {
            let { name, specific_request, id } = element;

            requesters.push(
                <div className="ui-card -notification" key={index.toString()}>
                    <img src={`http://i.pravatar.cc/100?img=${Math.floor(Math.random() * 10)}`} alt="avatar" />
                    <div className="ui-content">
                        <div className="ui-title">{name}</div>
                        <div className="ui-message">Requested: {specific_request}</div>
                    </div>
                    <button
                        className="acceptbutton"
                        type="button"
                        onClick={e => {
                            this.acceptRequest(e, index, id);
                        }}
                    >
                        Accept
                    </button>
                    <button
                        className="declinebutton"
                        type="button"
                        onClick={e => {
                            this.declineRequest(e, index, id);
                        }}
                    >
                        Decline
                    </button>
                </div>,
            );
        });

        return (
            <section className="layer" data-show="1">
                {requesters}
            </section>
        );
    }

    getDonators() {
        let donators: Array<JSX.Element> = [],
            { currentDonators } = this.state;

        currentDonators.forEach((element: any, index: Number) => {
            let { contact_name, company_name, product_name } = element;

            donators.push(
                <div className="ui-card -notification" key={index.toString()}>
                    <img src={`http://i.pravatar.cc/100?img=${Math.floor(Math.random() * 10)}`} alt="avatar" />
                    <div className="ui-content">
                        <div className="ui-title">
                            {contact_name}
                            {company_name !== '' ? ` @${company_name}` : null}
                        </div>
                        <div className="ui-message">Donated: {product_name}</div>
                    </div>
                    <button
                        className="thankyoubutton"
                        type="button"
                        onClick={e => {
                            this.thankYouConfirmation(e);
                        }}
                    >
                        Thank You
                    </button>
                    <button
                        className="messagebutton"
                        type="button"
                        onClick={e => {
                            this.socialMediaPromotion(e);
                        }}
                    >
                        Promote
                    </button>
                </div>,
            );
        });

        return (
            <section className="layer" data-show="1">
                {donators}
            </section>
        );
    }

    onRequestorPageChanged = (data: { currentPage: number; totalPages: number; pageLimit: number }) => {
        const { requests } = this.props;
        const { currentPage, totalPages, pageLimit } = data;

        const offset = (currentPage - 1) * pageLimit;
        const currentRequestors = requests.slice(offset, offset + pageLimit);

        this.setState({
            currentRequestPage: currentPage,
            currentRequestors,
            totalRequestPages: totalPages,
        });
    };

    onDonatorPageChanged = (data: { currentPage: number; totalPages: number; pageLimit: number }) => {
        const { donations } = this.props;
        const { currentPage, totalPages, pageLimit } = data;

        const donationOffset = (currentPage - 1) * pageLimit;
        const currentDonators = donations.slice(donationOffset, donationOffset + pageLimit);

        this.setState({
            currentDonationPage: currentPage,
            currentDonators,
            totalDonationPages: totalPages,
        });
    };

    render() {
        const totalItemsInRequestors = this.props.requests.length;
        const totalItemsInDonators = this.props.donations.length;

        if (totalItemsInRequestors === 0) return null;
        if (totalItemsInDonators === 0) return null;

        return (
            <section className="ADMIN">
                <div className="center3">
                    <div className="right">
                        <div className="title">Dashboard</div>
                        <div className="description">Track your food distribution</div>
                        <div className="row">
                            <div className="graph">
                                <svg viewBox="0 0 250 60" width="250" height="90">
                                    <path
                                        d="M 209.328 17.34 C 221.956 17.588 235.264 32.599 250 22.328"
                                        fill="none"
                                        vectorEffect="non-scaling-stroke"
                                        troke-width="2"
                                        stroke="rgb(243,243,250)"
                                        strokeLinejoin="miter"
                                        strokeLinecap="round"
                                        strokeMiterlimit="3"
                                    ></path>
                                    <linearGradient id="_lgradient_1" x1="0%" y1="50%" x2="100%" y2="50%">
                                        <stop offset="0%" stopOpacity="1" className="stylelish"></stop>
                                        {/* style="stop-color:rgb(120,113,255);" */}
                                        <stop offset="100%" stopOpacity="1" className="styleling"></stop>
                                        {/* style="stop-color:rgb(111,234,255);" */}
                                    </linearGradient>
                                    <path
                                        d=" M 0 43.634 C 5.934 43.634 11.318 51.209 17.462 51.342 C 33.219 51.683 30.603 59.567 39.187 59.868 C 46.963 60.141 50.44 44.192 60.537 43.77 C 69.126 43.77 72.129 52.461 79.739 52.433 C 90.904 52.433 94.93 38.455 106.648 39.78 C 129.082 42.317 124.556 27.606 139.157 27.177 C 153.758 26.747 158.235 44.485 171.96 44.725 C 196.438 45.155 189.782 17.1 208.248 17.1"
                                        fill="none"
                                        vectorEffect="non-scaling-stroke"
                                        troke-width="2"
                                        stroke="url(#_lgradient_1)"
                                        strokeLinejoin="miter"
                                        strokeLinecap="round"
                                        strokeMiterlimit="3"
                                    ></path>
                                    <path
                                        d="M 206.649 17.218 C 206.649 15.739 207.85 14.538 209.328 14.538 C 210.807 14.538 212.008 15.739 212.008 17.218 C 212.008 18.696 210.807 19.897 209.328 19.897 C 207.85 19.897 206.649 18.696 206.649 17.218 Z"
                                        fill="rgb(111,232,255)"
                                    ></path>
                                    <text transform="matrix(1,0,0,1,195,5)">+14%</text>

                                    {/* style="font-family:&amp;quot;Open Sans&amp;quot;;font-weight:700;font-size:12px;font-style:normal;fill:#6fe8ff;stroke:none;" */}
                                    <div className="stock">
                                        <div className="stock-logo paperpillar">
                                            <i className="fa fa-inverse fa-angle-double-up"></i>
                                        </div>
                                        <div className="stock-info">
                                            <div className="stock-name">Requestors</div>
                                            <div className="stock-fullname">Individuals</div>
                                        </div>
                                    </div>
                                </svg>
                            </div>
                            <div className="graph">
                                <svg viewBox="0 0 250 60" width="250" height="90">
                                    <path
                                        d="M 209.328 17.34 C 221.956 17.588 235.264 32.599 250 22.328"
                                        fill="none"
                                        vectorEffect="non-scaling-stroke"
                                        troke-width="2"
                                        stroke="rgb(243,243,250)"
                                        strokeLinejoin="miter"
                                        strokeLinecap="round"
                                        strokeMiterlimit="3"
                                    ></path>
                                    <linearGradient id="_lgradient_2" x1="0%" y1="50%" x2="100%" y2="50%">
                                        <stop offset="0%" stopOpacity="1"></stop>
                                        {/* style="stop-color:rgb(248, 135, 129);" */}
                                        <stop offset="100%" stopOpacity="1"></stop>
                                        {/* style="stop-color:rgb(247, 198, 130);" */}
                                    </linearGradient>
                                    <path
                                        d=" M 0 43.634 C 5.934 43.634 11.318 51.209 17.462 51.342 C 33.219 51.683 30.603 59.567 39.187 59.868 C 46.963 60.141 50.44 44.192 60.537 43.77 C 69.126 43.77 72.129 52.461 79.739 52.433 C 90.904 52.433 94.93 38.455 106.648 39.78 C 129.082 42.317 124.556 27.606 139.157 27.177 C 153.758 26.747 158.235 44.485 171.96 44.725 C 196.438 45.155 189.782 17.1 208.248 17.1"
                                        fill="none"
                                        vectorEffect="non-scaling-stroke"
                                        troke-width="2"
                                        stroke="url(#_lgradient_2)"
                                        strokeLinejoin="miter"
                                        strokeLinecap="round"
                                        strokeMiterlimit="3"
                                    ></path>
                                    <path
                                        d="M 206.649 17.218 C 206.649 15.739 207.85 14.538 209.328 14.538 C 210.807 14.538 212.008 15.739 212.008 17.218 C 212.008 18.696 210.807 19.897 209.328 19.897 C 207.85 19.897 206.649 18.696 206.649 17.218 Z"
                                        fill="rgb(247, 198, 130)"
                                    ></path>
                                    <text transform="matrix(1,0,0,1,195,5)">+14%</text>
                                    {/* style="font-family:&amp;quot;Open Sans&amp;quot;;font-weight:700;font-size:12px;font-style:normal;fill:rgb(247, 198, 130);stroke:none;" */}
                                </svg>
                                <div className="stock">
                                    <div className="stock-logo dandruft">
                                        <i className="fa fa-inverse fa-circle-thin"></i>
                                    </div>
                                    <div className="stock-info">
                                        <div className="stock-name">Donators</div>
                                        <div className="stock-fullname">Company</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="half">
                                <div className="sub-title">This Week's Requestors</div>
                                <div id="app">
                                    <div className="app-wrapper">{this.getRequesters()}</div>
                                    <Pagination
                                        totalRecords={totalItemsInRequestors}
                                        pageLimit={5}
                                        pageNeighbours={1}
                                        onPageChanged={this.onRequestorPageChanged}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="half">
                                <div className="sub-title">This Week's Donators</div>
                                <div id="app">
                                    <div className="app-wrapper">{this.getDonators()}</div>
                                    <Pagination
                                        totalRecords={totalItemsInDonators}
                                        pageLimit={5}
                                        pageNeighbours={1}
                                        onPageChanged={this.onDonatorPageChanged}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <a
                    className="inspiration "
                    href="https://github.com/PhinesTech"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    PhinesTech{' '}
                </a>
            </section>
        );
    }
}

export default Admin;
