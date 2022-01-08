import React from "react";
import RedTechIcon from "../../assets/images/RED_TECH_Icon_Full_Color.png";
import "../../App.css";
import {colors} from "../../shared/colors";
import { layout } from "../../shared/layout";

interface IProps { 
    label: string;
}
export default function Header(props: IProps) {
    const { label } = props;
    return <div style={{ display: "flex", padding: layout.standardComponentPadding, alignItems: "center", borderBottom: `1px solid ${colors.brandLightGray}` }}>
        <img src={RedTechIcon} className="headerLogo" alt="logo" style={{ marginRight: "16px"}}/>
        <span className="headerFont" style={{ color: colors.brandDarkGray }}>{label}</span>
    </div>
    }