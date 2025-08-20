"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

function Provider(props) {
	return <SessionProvider>{props.children}</SessionProvider>;
}

export default Provider;
