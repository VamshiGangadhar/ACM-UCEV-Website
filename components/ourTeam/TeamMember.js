import React from "react";

function TeamMember() {
  return (
    <>
      <div className="teamMember">
        <div className="teamMember__image">
          <Image src={this.props.member.image} />
        </div>
        <div className="teamMember__info">
          <div className="teamMember__name">
            <h3>{this.props.member.name}</h3>
          </div>
          <div className="teamMember__position">
            <h3>{this.props.member.position}</h3>
          </div>
          <div className="teamMember__about">
            <h3>{this.props.member.about}</h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default TeamMember;
