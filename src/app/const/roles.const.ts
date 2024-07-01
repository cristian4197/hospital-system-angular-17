export const roles = [
    'admin',//Puede modificar y eliminar todo
    'adminHospital',//Puede modificar hospitales pero no eliminar
    'adminDoctors',//Puede modificar doctores pero no eliminar
    'adminUsers',//Puede modificar usuarios pero no eliminar
    'viewer'//Puede visualizar unicamente
  ];

export const roleDescriptionMap: { [key: string]: string } = {
    'admin' : 'Admnistrador de Sistema',
    'adminHospital': 'Admnistrador de hospitales',
    'adminDoctors': 'Admnistrador de Doctores',
    'adminUsers': 'Admnistrador de Usuarios',
    'viewer': 'Solo Vista'    
  };
