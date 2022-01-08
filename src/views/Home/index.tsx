import React from "react";
import Page from "../../components/Page";
import DropdownSelect from '../../components/DropdownSelect';

export default function Home(){
    return <Page headerTitle={"Home"}>
        <>
        <DropdownSelect
            options={[{ label: 'here', value: 'now' }]}
            placeholder='stay here now'
            onSelectOption={() => console.log('hi')}
            value={{ label: 'there', value: 'somewhere'}}
        />
         Implement Project Here
        </>
    </Page>
}