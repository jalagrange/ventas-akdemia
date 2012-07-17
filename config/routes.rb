VentasAkdemia::Application.routes.draw do
  
  
  resources :schools

  root :to => 'schools#index'

end
