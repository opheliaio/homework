#1a. Display the first and last names of all actors from the table actor.
select first_name, last_name from actor;

#1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name.
select upper(concat(first_name, " ", last_name)) AS "Actor Name" from actor;

#2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." What is one query would you use to obtain this information?
select actor_id, first_name, last_name from actor where first_name = "Joe";

#2b. Find all actors whose last name contain the letters GEN:
select * from actor where last_name like "%GEN%";

#2c. Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:
select * from actor where last_name like "%LI%" order by last_name, first_name;

#2d. Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China:
select country_id, country from country where country in ("Afghanistan", "Bangladesh", "China");

#3a. Add a middle_name column to the table actor. Position it between first_name and last_name. Hint: you will need to specify the data type.
alter table actor add middle_name varchar(100) after first_name;

#3b. You realize that some of these actors have tremendously long last names. Change the data type of the middle_name column to blobs.
alter table actor modify middle_name blob;

#3c. Now delete the middle_name column.
alter table actor drop middle_name;

#4a. List the last names of actors, as well as how many actors have that last name.
select last_name, count(*) from actor group by last_name;

#4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
select last_name, cnt as "#Actors" from
(select last_name, count(*) as cnt from actor group by last_name) t
where cnt > 1;

#4c. Oh, no! The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS, the name of Harpo's second cousin's husband's yoga teacher. Write a query to fix the record.
update actor 
set first_name= "HARPO" where first_name = "GROUCHO" and last_name ="WILLIAMS";

#4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all!
#In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO. 
#Otherwise, change the first name to MUCHO GROUCHO, as that is exactly what the actor will be with the grievous error. 
#BE CAREFUL NOT TO CHANGE THE FIRST NAME OF EVERY ACTOR TO MUCHO GROUCHO, HOWEVER! (Hint: update the record using a unique identifier.)
select * from actor where first_name = "HARPO";
update actor 
set first_name = IF(last_name = "WILLIAMS", "GROUCHO", "MUCHO GROUCHO") where actor_id = 172;

#5a. You cannot locate the schema of the address table. Which query would you use to re-create it?
#Hint: https://dev.mysql.com/doc/refman/5.7/en/show-create-table.html
show create table address;

#6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
select first_name, last_name, address from Staff s left join address a on s.address_id = a.address_id;
#6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.
select first_name, last_name, sum(amount) from staff s 
left join payment p on s.staff_id = p.staff_id
where payment_date>="2005-08-01" and payment_date<="2005-08-31" group by first_name, last_name;
select * from payment;
#6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
select title, count(actor_id) from film f inner join film_actor fa on f.film_id = fa.film_id group by title;

#6d. How many copies of the film Hunchback Impossible exist in the inventory system?
select count(title) as "# of film Hunchback Impossible" from film f left join inventory i on f.film_id = i.film_id where title ="Hunchback Impossible";

#6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer.
#List the customers alphabetically by last name:
select sum(amount) as "Total paid by each customer", first_name, last_name from customer c left join payment p on c.customer_id = p.customer_id group by first_name, last_name order by last_name;

#![Total amount paid](Images/total_payment.png)
#7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. 
#As an unintended consequence, films starting with the letters K and Q have also soared in popularity.
#Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.
select title from film f left join language l on f.language_id=l.language_id where (title like "K%" or title like "Q%") and l.name ="English";
#7b. Use subqueries to display all actors who appear in the film Alone Trip.
select first_name, last_name from actor a left join film_actor fa on a.actor_id = fa.actor_id 
where film_id in (select film_id from film where title = "Alone Trip"); 
#7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all
#Canadian customers. Use joins to retrieve this information.
#select first_name, last_name, email from customer left join address using (address_id) left join city using (city_id) left join country using (country_id) where country = "Canada";
select name, email from customer_list cl left join customer c on (cl.ID = c.customer_id) where country = "Canada";

#7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. 
#Identify all movies categorized as famiy films.
#select title from film left join film_category using (film_id) left join category using (category_id) where category.name ="Family";
select title from film_list where category = "Family";

#7e. Display the most frequently rented movies in descending order.
select title, rental_rate from film order by rental_rate desc; 

#7f. Write a query to display how much business, in dollars, each store brought in.
#select store_id, sum(amount) from store left join inventory using(store_id) left join rental using(inventory_id) left join payment using (rental_id) group by store_id;
select store, total_sales from sales_by_store;

#7g. Write a query to display for each store its store ID, city, and country.
select store_id, city, country from store left join address using (address_id) left join city using (city_id) left join country using (country_id);

#7h. List the top five genres in gross revenue in descending order.
# (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)
select * from sales_by_film_category order by total_sales desc limit 5;

#8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. 
#Use the solution from the problem above to create a view.
#If you haven't solved 7h, you can substitute another query to create a view.
create view top5 as select * from sales_by_film_category order by total_sales desc limit 5;

#8b. How would you display the view that you created in 8a?
select * from top5;

#8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
drop view top5;