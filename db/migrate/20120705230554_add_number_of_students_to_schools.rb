class AddNumberOfStudentsToSchools < ActiveRecord::Migration
  def change
    add_column :schools, :number_of_students, :integer
  end
end
