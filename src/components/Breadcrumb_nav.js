import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import{Link} from'react-router-dom';

const Breadcrumb_nav = (props) => {
  return (
    <div>
      <Breadcrumb tag="nav" listTag="div">
      
        <BreadcrumbItem tag="a" href="/">Home</BreadcrumbItem>
        <BreadcrumbItem tag="a" href="/listTalleres/:id_ar">Talleres</BreadcrumbItem>
        <BreadcrumbItem active tag="span">Evaluacion</BreadcrumbItem>
        
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumb_nav;