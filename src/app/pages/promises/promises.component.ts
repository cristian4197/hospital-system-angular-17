import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promises',
  standalone: true,
  imports: [],
  templateUrl: './promises.component.html',
  styleUrl: './promises.component.css'
})
export default class PromisesComponent implements OnInit {

  ngOnInit(): void {
    this.getUsuarios()
      .then(users => console.log(users));
    // const promise = new Promise((resolve, reject) => {
    //   if(false){
    //     resolve('Exito en Promesa');
    //   }else {
    //     reject('Error en Promesa');
    //   }
    // });

    // promise
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    
    // console.log('Segundo Hola Mundo');
    
  }

  getUsuarios() {
    return new Promise((resolve) => {
      fetch('https://reqres.in/api/users')
      .then(response => response.json())
      .then(body => resolve(body.data))
    });
  }


}
