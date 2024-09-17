require("dotenv").config();
const mongoose = require("mongoose");
const { Menu, Section, Item } = require("./Menu");

const lunchMenu = {
  sections: [
    {
      header: "HOT SANDWICHES",
      description:
        "served on our fresh baked italian bread with demi's own sweet potato chips",
      items: [
        {
          name: "MEATBALL SANDWICH",
          description: "homemade meatballs, marinara and melted mozzarella",
          price: [11.75],
        },
        {
          name: "CHICKEN PESTO",
          description:
            "grilled chicken breast, pesto, onions, tomatoes and melted parmesan",
          price: [11.75],
        },
        {
          name: "CHICKEN PARMIGIANO",
          description: "grilled chicken breast, marinara and melted mozzarella",
          price: [11.75],
        },
      ],
    },
    {
      header: "SPECIALTY SANDWICHES",
      description:
        "served on our fresh baked italian bread, focaccia, or panini with sweet potato chips",
      items: [
        {
          name: "BOCCOCINI",
          description:
            "fresh mozzarella, spinach, tomato and pesto with italian vinaigrette",
          price: [11.5],
        },
        {
          name: "GRILLED VEGETABLE",
          description:
            "zucchini, yellow squash, roasted red peppers, spinach and goat cheese",
          price: [11.5],
        },
        {
          name: "L'ITALIANO",
          description:
            "genoa salami, capicollo, prosciutto, fresh mozzarella, roasted red peppers, fresh spinach and italian vinaigrette",
          price: [11.5],
        },
        {
          name: "NAPOLEAN VEGETABLE",
          description:
            "marinated artichoke hearts, roasted red peppers, fontinella cheese, basil and balsamic vinaigrette",
          price: [11.5],
        },
        {
          name: "TURKEY SICILIANO",
          description:
            "smoked turkey breast with honey mustard, swiss cheese and pimento olives",
          price: [10.5],
        },
        {
          name: "TURKEY MONA LISA",
          description:
            "smoked turkey breast with smoked mozzarella, roasted red peppers, red onion and balsamic vinaigrette",
          price: [10.5],
        },
      ],
    },
    {
      header: "PASTA SPECIALS",
      description: "served with a small romaine salad and bread",
      items: [
        {
          name: "CONCHIGLIETTI",
          description: "with fresh herbed tomato cream sauce",
          price: [12.5],
        },
        {
          name: "LINGUINI MARINARA",
          description: "with a homemade meatball",
          price: [12.5],
        },
        {
          name: "RIGATONI PRIMAVERA",
          description:
            "with broccoli, extra virgin olive oil, and parmesan cheese",
          price: [12.5],
        },
        {
          name: "RIGATONI AND RICOTTA",
          description: "with mozzarella, pecorino, and marinara",
          price: [12.5],
        },
      ],
    },
    {
      header: "PETITE SANDWICHES",
      description:
        "served on our fresh baked italian bread with a small salad and sweet potato chips",
      items: [
        {
          name: "TURKEY MONA LISA",
          price: [9.75],
        },
        {
          name: "BOCCOCINI",
          price: [9.75],
        },
        {
          name: "TURKEY SICILIANO",
          price: [9.75],
        },
      ],
    },
    {
      header: "OTHER LUNCH SPECIALS",
      items: [
        { name: "Pasta of the Day and House Salad", price: [13] },
        { name: '9" Pizza: Cheese, Sausage or Pepperoni', price: [11.25] },
        { name: "House Salad and Bowl of Soup", price: [9.5] },
        {
          name: "Half Specialty Sandwich and House Salad or Cup of Soup",
          price: [10.25],
        },
        { name: "Basket of Bread or Sweet Potato Chips", price: [2.25] },
      ],
    },
  ],
};

const dinnerMenu = {
  sections: [
    {
      header: "FOR THE TABLE",
      items: [
        {
          name: "BAKED GOAT CHEESE",
          description:
            "in fresh herbed marinara, served with toasted rustic pesto bread",
          price: 10.0,
        },
        {
          name: "BRUSCHETTA",
          description:
            "toasted rustic bread with diced tomato, basil, and garlic",
          price: 8.5,
        },
        {
          name: "CALAMARI",
          description:
            "flash fried and tossed with parmesan, pepperoncini, lemon, and parsley, served with spicy marinara sauce",
          price: 12.5,
        },
        {
          name: "MUSSELS",
          description: "sun-dried tomatoes, fresh herbs, and white wine crema",
          price: 13.0,
        },
        {
          name: "CHEESE PLATTER",
          description: "with berries, and arugula",
          price: 5,
          platters: [
            {
              name: "Gorgonzola",
              price: 5,
            },
            {
              name: "Goat",
              price: 5,
            },
            {
              name: "Pecorino Romano",
              price: 5,
            },
            {
              name: "Fontinella",
              price: 5,
            },
          ],
        },
        {
          name: "MEAT PLATTER",
          description: "with arugula, olives, and tomatoes",
          platter: ["Prosciutto", "Pancetta", "Capicola", "Genoa Salami"],
          price: 5,
          platters: [
            {
              name: "Prosciutto",
              price: 5,
            },
            {
              name: "Pancetta",
              price: 5,
            },
            {
              name: "Capicola",
              price: 5,
            },
            {
              name: "Genoa Salami",
              price: 5,
            },
          ],
        },
      ],
    },
    {
      header: "SMALL PLATES",
      items: [
        {
          name: "ARANCINE",
          description:
            "crisp, breaded risotto balls with fontinella, prosciutto, and parmesan",
          price: [6.75],
        },
        {
          name: "GRILLED OCTOPUS",
          description:
            "cannelloni beans, arugula, fresh herbs, and lemon balsamic",
          price: [14.0],
        },
        {
          name: "MEATBALLS",
          description: "our famous all-beef meatballs in marinara",
          price: [8.5],
        },
        {
          name: "SOUP OF THE DAY",
          description: "made in house, changes daily",
          price: [3, 6],
          sizes: [
            {
              name: "Cup",
              price: 3,
            },
            {
              name: "Bowl",
              price: 6,
            },
          ],
        },
      ],
    },
    {
      header: "SALADS",
      description: "with house-made dressing",
      items: [
        {
          name: "CLASSIC CAESAR SALAD",
          description: "anchovies, homemade croutons, and shaved parmesan",
          price: [14.0],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Extra dressing",
              price: 0.75,
            },
          ],
        },
        {
          name: "GRILLED CHICKEN SALAD",
          description:
            "romaine, tomato, mozzarella, red onion, red cabbage with italian dressing",
          price: [16.0],
          options: [
            {
              item: "Extra dressing",
              price: 0.75,
            },
          ],
        },
        {
          name: "INSALATA CAPRESE",
          description: "shingled tomato, mozzarella, red onion, basil",
          price: [14.0],
          options: [
            {
              item: "Extra dressing",
              price: 0.75,
            },
          ],
        },
        {
          name: "MIXED GREENS",
          description: "tomato, red onion, and balsamic vinaigrette",
          price: [12.0],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Extra dressing",
              price: 0.75,
            },
          ],
        },
        {
          name: "SHRIMP SALAD",
          description:
            "romaine, tomato, mozzarella, red onion, red cabbage with italian dressing",
          price: [19.0],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Extra dressing",
              price: 0.75,
            },
          ],
        },
        {
          name: "WALNUT-GORGONZOLA",
          description:
            "arugula, shaved pear, and tomato with walnut dijon vinaigrette",
          price: [14.0],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Extra dressing",
              price: 0.75,
            },
          ],
        },
      ],
    },
    {
      header: "PASTA",
      description: "whole wheat and gluten free available",
      items: [
        {
          name: "ANGEL HAIR",
          description: "artichokes with pesto and marinara",
          price: [16.5],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Whole wheat Pasta",
              price: 2,
            },
            {
              item: "Gluten free Pasta",
              price: 2,
            },
          ],
        },
        {
          name: "ASIAGO STUFFED GNOCCHI",
          description: "topped with chicken parmesan in a creamy vodka sauce",
          price: [21.0],
        },
        {
          name: "BAKED RIGATONI",
          description: "with ricotta, mozzarella and marinara",
          price: [16.75],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Whole wheat Pasta",
              price: 2,
            },
            {
              item: "Gluten free Pasta",
              price: 2,
            },
          ],
        },
        {
          name: "CHEESE LASAGNA",
          description: "with marinara or meat sauce",
          price: [10.75, 14.75],
          sauces: [
            {
              item: "Marinara Sauce",
              price: 0,
            },
            {
              item: "Meat Sauce",
              price: 2,
            },
          ],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
          ],
          sizes: [
            {
              name: "Small",
              price: 0,
            },
            {
              name: "Regular",
              price: 4,
            },
          ],
        },
        {
          name: "CHEESE RAVIOLI",
          description: "with fresh basil and marinara",
          price: [14.75],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
          ],
        },
        {
          name: "CONCHIGLIETTI",
          description: "with fresh herbed tomato cream sauce",
          price: [10, 13.75],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Whole wheat Pasta",
              price: 2,
            },
            {
              item: "Gluten free Pasta",
              price: 2,
            },
          ],
          sizes: [
            {
              name: "Small",
              price: 0,
            },
            {
              name: "Regular",
              price: 4,
            },
          ],
        },
        {
          name: "FARFALLE WITH CHICKEN",
          description: "with zucchini and tomatoes in white wine and lemon",
          price: [16.75],
          options: [
            {
              item: "Whole wheat Pasta",
              price: 2,
            },
            {
              item: "Gluten free Pasta",
              price: 2,
            },
          ],
        },
        {
          name: "FARFALLE WITH SALMON",
          description: "asparagus, tomato, white wine, topped with parmesan",
          price: [23.75],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Whole wheat Pasta",
              price: 2,
            },
            {
              item: "Gluten free Pasta",
              price: 2,
            },
          ],
        },
        {
          name: "HOMEMADE SPINACH GNOCCHI",
          description: "light marinara, basil, parmesan, and tomatoes",
          price: [16.5],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
          ],
        },
        {
          name: "LINGUINE MARINARA",
          description: "with our famous all-beef meatballs",
          price: [12.75, 16.75],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Whole wheat Pasta",
              price: 2,
            },
            {
              item: "Gluten free Pasta",
              price: 2,
            },
          ],
          sizes: [
            {
              name: "Small",
              price: 0,
            },
            {
              name: "Regular",
              price: 4,
            },
          ],
        },
        {
          name: "LINGUINE SHRIMP SCAMPI",
          description: "with tomatoes, pine nutes, and parmesan cheese",
          price: [23.75],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Whole wheat Pasta",
              price: 2,
            },
            {
              item: "Gluten free Pasta",
              price: 2,
            },
          ],
        },
        {
          name: "LINGUINE WITH CLAMS AND MUSSELS",
          description: "prosciutto, white wine, & flakes of red pepper",
          price: 24.0,
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Whole wheat Pasta",
              price: 2,
            },
            {
              item: "Gluten free Pasta",
              price: 2,
            },
          ],
        },
        {
          name: "RIGATONI AND RICOTTA",
          description: "with mozzarella, percorino, and marinara sauce",
          price: [11, 15],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Whole wheat Pasta",
              price: 2,
            },
            {
              item: "Gluten free Pasta",
              price: 2,
            },
          ],
          sizes: [
            {
              name: "Small",
              price: 0,
            },
            {
              name: "Regular",
              price: 4,
            },
          ],
        },
        {
          name: "RIGATONI PRIMAVERA",
          description: "broccoli, garlic, olive oil, and parmesan",
          price: [10.75, 14.75],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Whole wheat Pasta",
              price: 2,
            },
            {
              item: "Gluten free Pasta",
              price: 2,
            },
          ],
          sizes: [
            {
              name: "Small",
              price: 0,
            },
            {
              name: "Regular",
              price: 4,
            },
          ],
        },
        {
          name: "SPINACH LASAGNA",
          description:
            "with ricotta, mozzarella, and herbed tomato cream sauce",
          price: [13, 17],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
          ],
          sizes: [
            {
              name: "Small",
              price: 0,
            },
            {
              name: "Regular",
              price: 4,
            },
          ],
        },
        {
          name: "TAGLIATELLE",
          description:
            "with truffled wild mushrooms, sweet peas, and ricotta salata",
          price: [21.0],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Whole wheat Pasta",
              price: 2,
            },
            {
              item: "Gluten free Pasta",
              price: 2,
            },
          ],
        },
        {
          name: "TORTELLINI DELLA NONNA",
          description:
            "beef filled pasta with spinach, prosciutto, & white cream sauce",
          price: [18.75],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
          ],
        },
        {
          name: "ZITI PRIMAVERA",
          description:
            "green beans, mushrooms, tomatoes, onions, olive oil, and mozzarella",
          price: [14.75],
          options: [
            {
              item: "Add Chicken",
              price: 4,
            },
            {
              item: "Whole wheat Pasta",
              price: 2,
            },
            {
              item: "Gluten free Pasta",
              price: 2,
            },
          ],
        },
      ],
    },
    {
      header: "PIZZA",
      description: "whole wheat and gluten free available",
      items: [
        {
          name: "DEMI",
          description: "chicken, fresh tomato, mozzarella, and pesto",
          price: [14.75, 17.75, 20.75],
          sizes: [
            {
              name: '9"',
              price: 0,
            },
            {
              name: '12"',
              price: 3,
            },
            {
              name: '14"',
              price: 6,
            },
          ],
        },
        {
          name: "FLORENTINE",
          description:
            "grilled squash, zucchini, eggplant, red pepper, spinach, goat cheese, mozzarella, marinara",
          price: [14.75, 17.75, 20.75],
          sizes: [
            {
              name: '9"',
              price: 0,
            },
            {
              name: '12"',
              price: 3,
            },
            {
              name: '14"',
              price: 6,
            },
          ],
        },
        {
          name: "GENOA",
          description:
            "salami, green olive, onion, pecorino, mozzarella, marinara",
          price: [13.75, 16.75, 19.75],
          sizes: [
            {
              name: '9"',
              price: 0,
            },
            {
              name: '12"',
              price: 3,
            },
            {
              name: '14"',
              price: 6,
            },
          ],
        },
        {
          name: "MARGHERITA",
          description: "tomatoes, fresh mozzarella, fresh basil, and marinara",
          price: [12.75, 15.75, 18.75],
          sizes: [
            {
              name: '9"',
              price: 0,
            },
            {
              name: '12"',
              price: 3,
            },
            {
              name: '14"',
              price: 6,
            },
          ],
        },
        {
          name: "PARMA",
          description: "prosciutto, shaved parmesan, marinara, basil",
          price: [13.75, 16.75, 19.75],
          sizes: [
            {
              name: '9"',
              price: 0,
            },
            {
              name: '12"',
              price: 3,
            },
            {
              name: '14"',
              price: 6,
            },
          ],
        },
        {
          name: "ROMA",
          description: "broccoli, jicama, tomato, marinara, and mozzarella",
          price: [12.75, 15.75, 18.75],
          sizes: [
            {
              name: '9"',
              price: 0,
            },
            {
              name: '12"',
              price: 3,
            },
            {
              name: '14"',
              price: 6,
            },
          ],
        },
        {
          name: "SICILIAN",
          description: "marinara, shrimp, anchovy, black olive, mozzarella",
          price: [14.75, 17.75, 20.75],
          sizes: [
            {
              name: '9"',
              price: 0,
            },
            {
              name: '12"',
              price: 3,
            },
            {
              name: '14"',
              price: 6,
            },
          ],
        },
      ],
    },
    {
      header: "ENTRÉES",
      items: [
        {
          name: "GRILLED NEW YORK STRIP STEAK",
          description:
            "tender choice steak with rosemary mashed red potatoes, green beans, and barolo wine sauce",
          price: [25.75],
        },
        {
          name: "CHICKEN PARMIGIANO",
          description:
            "lightly breaded chicken breasts on a bed of linguine marinara, topped with melted parmesan",
          price: [20.0],
        },
        {
          name: "VEAL SCALOPPINE",
          description:
            "with sautéed spinach, gorgonzola, and creamy wild mushroom marsala",
          price: [25.0],
        },
        {
          name: "LAMB SHANK",
          description:
            "on the bone lamb shank with mustard glaze, rosemary mashed potatoes and grilled asparagus with fresh basil sauce",
          price: [29.75],
        },
        {
          name: "ORGANIC PETITE CHICKEN",
          description:
            "pan-roasted whole and semi-deboned on broccoli sautéed with garlic, pine nuts, oven-roasted tomato, and sage crema broth",
          price: [23.0],
        },
      ],
    },
    {
      header: "SEAFOOD",
      items: [
        {
          name: "CIOPPINO",
          description:
            "made-to-order stew of clams, mussels, calamari, octopus, shrimp, and bronzini with potato and leeks in a spiced tomato broth served with rustic croutons",
          price: [29.0],
        },
        {
          name: "GRILLED SALMON",
          description:
            "fresh Atlantic salmon on cannellini beans, roasted tomato, leeks, pancetta, arugula, and fresh herb broth",
          price: [25.0],
        },
        {
          name: "PAN-ROASTED BRONZINI",
          description:
            "mediterranean sea bass on sautéed jicama, green beans, roasted sweet corn, tomatoes, leeks with fire-roasted citrus sauce",
          price: [32],
        },
        {
          name: "SHRIMP RISOTTO",
          description:
            "with fresh basil, lemon, roasted tomatoes, and flakes of red pepper",
          price: [22.75],
        },
      ],
    },
    {
      header: "SIDES",
      items: [
        {
          name: "BROCCOLI",
          price: [4.25],
        },
        {
          name: "DINNER SALAD WITH HOUSE-MADE ITALIAN DRESSING",
          price: [6.0],
        },
        {
          name: "GRILLED ASPARAGUS",
          price: [4.5],
        },
        {
          name: "GRILLED CHICKEN",
          price: [5.25],
        },
        {
          name: "MEATBALL",
          price: [4.5],
        },
        {
          name: "PASTA: PLAIN, BUTTERED, MARINARA, OR OLIVE OIL",
          price: [9.25],
        },
        {
          name: "SAUTÉED SHRIMP",
          price: [7.25],
        },
      ],
    },
    {
      header: "DESSERTS",
      items: [
        {
          name: "HAZELNUT PEAR TART",
          description: "Served warm, with amaretto sauce and coffee gelato",
          price: [11.75],
        },
        {
          name: "LIMÓNCELLO CRÉME BRULEE",
          description: "With fresh berries",
          price: [9.5],
        },
        {
          name: "MOLTEN CHOCOLATE CAKE",
          description: "Served warm, with raspberry sauce and vanilla gelato",
          price: [11.0],
        },
        {
          name: "TIRAMISU",
          description: "With fresh berries",
          price: [10.5],
        },
      ],
    },
    {
      header: "DRINKS",
      items: [
        {
          name: "COFFEE",
          price: [3.95],
        },
        {
          name: "HOT TEA, FRESH BREWED ICE TEA",
          price: [3.95],
        },
        {
          name: "MILK",
          price: [2.95],
        },
        {
          name: "ORANGE OR LEMON SAN PELLEGRINO 6OZ",
          price: [4.25],
        },
        {
          name: "RC, DIET RITE, GREEN RIVER, 7-UP, ROOT BEER, LEMONADE, CRANBERRY JUICE",
          price: [3.95],
        },
        {
          name: "SAN PELLEGRINO MINERAL WATER 33OZ",
          price: [5.75],
        },
        {
          name: "SMERALDINA SPARKLING WATER 8.47OZ",
          price: [3.75],
        },
      ],
    },
    {
      header: "BEER",
      items: [
        {
          name: "AMSTEL LIGHT",
          price: [7.25],
        },
        {
          name: "HEINEKEN",
          price: [7.25],
        },
        {
          name: "HEINEKEN 0.0 NON-ALCOHOLIC",
          price: [6.95],
        },
        {
          name: "MILLER LITE",
          price: [7.25],
        },
        {
          name: "MORETTI",
          price: [7.25],
        },
        {
          name: "PERONI",
          price: [7.25],
        },
        {
          name: "BUD'S CORVUS IRISH STYLE DRY STOUT",
          price: [8.25],
        },
        {
          name: "SKETCHBOOK ORANGE DOOR IPA",
          price: [8.25],
        },
      ],
    },
  ],
};

const wineList = {
  sections: [
    {
      header: "ROSE",
      items: [
        {
          name: "Le Charmel Rose, Cotes De Provence",
          description:
            "dry rose wine. the nose has beautiful aromas of raspberries and wild flowers. the palate is wonderfully bright and fresh with notes of strawberry and pear",
          price: [9.25, 31],
        },
      ],
    },
    {
      header: "BUBBLY",
      items: [
        {
          name: "Saracco Moscato D'Asti, Italy",
          description:
            "flavors of apricot and peach, sweet but not syrup sweet. great on its own or with dessert",
          price: [8.25],
        },
        {
          name: "Tiamo Prosecco, Italy",
          description:
            "this effusive fruity, light-bodied effervescent wine offers terrific notes with a refreshing finish",
          price: [10],
        },
      ],
    },
    {
      header: "WHITE",
      items: [
        {
          name: "Tera Alpina Chardonnay, Magre, Italy",
          description:
            "made with organic grapes the aroma is delicate with pronounced notes of subtropical fruit. quite intense in flavor and a lively acidity",
          price: [12.35, 43.5],
        },
        {
          name: "Bex Riesling, Germany",
          description:
            "notes of honeysuckle flowers, fresh pineapple, apricot tart, fresh peach and nectarine with a creamy, almost whipped cream finish",
          price: [8.75, 29],
        },
        {
          name: "Beyond Savignon Blanc, South Africa",
          description:
            "organically produced with guava and fresh herbal aromas. the full-bodied palate exudes fresh herbs, nettle and a long mineral finish",
          price: [8.5, 29],
        },
        {
          name: "Feudi Di San Gregorio Falanghina, Italy",
          description:
            "this 100% falanghina is a captivating, aromatic white wine with flavors of lush tropical fruits. enjoy with seafood, chicken, or pasta",
          price: [10, 34],
        },
        {
          name: "Le Pianure Pinot Grigio, Delle Venezie, Italy",
          description:
            "light-medium bodied, fresh and complex with flavors of lemon, apple and sage, backed with subtle minerality",
          price: [9.5, 32],
        },
      ],
    },
    {
      header: "RED",
      items: [
        {
          name: "Cembra Pinot Nero, Italy",
          description:
            "this wine has a delicate aroma evoking forest fruits and cherry. it has soft tannins that lead to a strong finish.",
          price: [11.5, 40],
        },
        {
          name: "Cetamura Chianti, Italy",
          description:
            "intense ruby red color with aromas of berries and flowers. perfect with simple and genuine flavors of Tuscan cuisine",
          price: [10.25, 35],
        },
        {
          name: "Le Pianure Merlot, Venezia Giulia, Italy",
          description:
            "dry, smooth and fruit with notes of blackberry, raspberry and plum",
          price: [8, 29],
        },
        {
          name: "Giancarlo Montepulciano, D'Abruzzo, Italy",
          description:
            "spicy, herby, dark fruit characters, balanced acidity with good body and width. no oak gives this wine vibrancy and depth rarely seen at this price",
          price: [29],
        },
        {
          name: `House Red - Substance "RB" Red Blend, Washington State`,
          description:
            "expressive, bright and juicy with black plum, black currant and dried blueberry intertwined and layered with dark chocolate, black tea, and marzipan",
          price: [10.75, 40],
        },
        {
          name: "Le Pianure Cabernet, Venezia Giulia, Italy",
          description:
            "easy drinking, fruit forward with a touch of spice. perfect with red meats and pasta",
          price: [32],
        },
        {
          name: "Oxford Landing Shiraz, Australia",
          description:
            "soft and supple with lingering flavors of red cherry, raspberry, and licorice. a small amount of Viognier is blended in to enhance the Shiraz",
          price: [7.75, 25],
        },
        {
          name: "Ricossa Barbera D'Asti, Piedmont, Italy",
          description:
            "fresh and upfront aromas of sour cherry and wild raspberries mix with hints of fresh herbs and warmed earth",
          price: [9, 33],
        },
        {
          name: "Zuccardi Malbec, Argentina",
          description:
            "purple-black color and bursting with blackcurrant and plum aromas. full-bodied with rich black cherry and chocolate notes and a velvety finish",
          price: [10.5, 36],
        },
      ],
    },
  ],
};

const port = process.env.PORT || 4000;
const mongo_uri = process.env.MONGO_URI;

async function main() {
  console.log("main");
  try {
    await mongoose.connect(mongo_uri);
    console.log("Database connected Successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }

  mongoose.connection
    .once("open", function () {
      console.log("Database connected Successfully");
    })
    .on("error", function (err) {
      console.log("Error", err);
    });

  updateMenu();
}

async function updateMenuData(menuType, menuData) {
  let menuId;

  // Find old menu associated with the menuType
  const oldMenu = await Menu.findOne({ menuType: menuType });

  if (oldMenu) {
    // If old menu exists, remove its sections and items but NOT the menu itself
    await Section.deleteMany({ menuId: oldMenu._id });
    await Item.deleteMany({ menuId: oldMenu._id });
    console.log(`Old ${menuType} menu sections and items deleted successfully`);
    menuId = oldMenu._id;
  } else {
    // If there's no existing menu, create a new one
    const menu = new Menu({ menuType: menuType });
    await menu.save();
    menuId = menu._id;
  }

  // Save new sections and items
  const sectionIds = [];
  for (const sectionData of menuData.sections) {
    const items = sectionData.items;
    delete sectionData.items;

    const section = new Section({
      ...sectionData,
      menuId: menuId,
    });
    await section.save();

    sectionIds.push(section._id);

    // Save all items concurrently for a section
    const itemPromises = items.map((itemData) => {
      const item = new Item({
        ...itemData,
        sectionId: section._id,
        menuId: menuId,
      });
      return item.save();
    });

    await Promise.all(itemPromises);
  }

  // Update the menu with the new section IDs
  const updatedMenu = await Menu.findById(menuId);
  updatedMenu.sectionIds = sectionIds;
  updatedMenu.lastUpdated = new Date();
  await updatedMenu.save();

  console.log(`${menuType} menu updated successfully.`);
}

async function updateMenu() {
  try {
    await updateMenuData("lunch", lunchMenu);
    await updateMenuData("dinner", dinnerMenu);
    await updateMenuData("wine", wineList);
  } catch (err) {
    console.error("Error saving menus:", err);
  }
  process.exit(0);
}

main();
