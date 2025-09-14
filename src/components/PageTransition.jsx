// src/components/PageTransition.jsx
import React, { useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "../styles/PageTransition.css";

const PageTransition = ({ children, locationKey }) => {
  const nodeRef = useRef(null); // ✅ Add nodeRef

  return (
    <SwitchTransition>
      <CSSTransition
        key={locationKey}
        classNames="fade"
        timeout={300}
        unmountOnExit
        nodeRef={nodeRef} // ✅ Pass nodeRef
      >
        <div ref={nodeRef} className="page-transition">
          {children}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default PageTransition;
