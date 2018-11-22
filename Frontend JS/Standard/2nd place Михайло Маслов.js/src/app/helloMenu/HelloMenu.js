import React from 'react';

const HelloMenu = props => {
  const { createCrossword, gameCrossword } = props;
  
  return (
    <div className="hello-menu mdl-card mdl-shadow--2dp">
      <div className="mdl-card__title">
        <h2 className="mdl-card__title-text">Welcome</h2>
      </div>
      <div className="mdl-card__actions mdl-card--border">
        <button className="mdl-button mdl-button--colored"
           onClick={createCrossword}
        >
          Create crossword
        </button>
         or
        <button className="mdl-button mdl-button--colored"
                onClick={gameCrossword}
        >
          Game example crossword
        </button>
      </div>
    </div>
  )
};

export default HelloMenu;