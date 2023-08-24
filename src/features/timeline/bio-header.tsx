import React from 'react';

type BioHeaderProps = {
  name: string;
  title: string;
  bio: string;
};

function BioHeader({ name, title, bio }: BioHeaderProps) {
  return (
    <div>
      <h1>{name}</h1>
      <h2>{title}</h2>
      <p>{bio}</p>
    </div>
  );
}

export default BioHeader;
