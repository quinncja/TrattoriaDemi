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
          description: "homemade meatballs, marinara, and melted mozzarella",
          price: 11.25,
        },
        {
          name: "CHICKEN PESTO",
          description:
            "grilled chicken breast, pesto, onions, tomatoes, and melted parmesan",
          price: 11.25,
        },
        {
          name: "CHICKEN PARMIGIANO",
          description:
            "grilled chicken breast, marinara, and melted mozzarella",
          price: 11.25,
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
          price: 10.5,
        },
        {
          name: "GRILLED VEGETABLE",
          description:
            "zucchini, yellow squash, roasted red peppers, spinach and goat cheese",
          price: 10.5,
        },
        {
          name: "L'ITALIANO",
          description:
            "genoa salami, capicollo, prosciutto, fresh mozzarella, roasted red peppers, fresh spinach and italian vinaigrette",
          price: 9.5,
        },
        {
          name: "NAPOLEAN VEGETABLE",
          description:
            "marinated artichoke hearts, roasted red peppers, fontinella cheese, basil and balsamic vinaigrette",
          price: 9.5,
        },
        {
          name: "TURKEY SICILIANO",
          description:
            "smoked turkey breast with honey mustard, swiss cheese and pimento olives",
          price: 8.75,
        },
        {
          name: "TURKEY MONA LISA",
          description:
            "smoked turkey breast with smoked mozzarella, roasted red peppers, red onion and balsamic vinaigrette",
          price: 8.75,
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
          price: 10.99,
        },
        {
          name: "LINGUINI MARINARA",
          description: "with a homemade meatball",
          price: 10.99,
        },
        {
          name: "RIGATONI PRIMAVERA",
          description:
            "with broccoli, extra virgin olive oil, and parmesan cheese",
          price: 10.99,
        },
        {
          name: "RIGATONI AND RICOTTA",
          description: "with mozzarella, pecorino, and marinara",
          price: 10.99,
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
          price: 8.75,
        },
        {
          name: "BOCCOCINI",
          price: 8.75,
        },
        {
          name: "TURKEY SICILIANO",
          price: 8.75,
        },
      ],
    },
    {
      header: "OTHER LUNCH SPECIALS",
      items: [
        { name: "Pasta of the Day and House Salad", price: 11.5 },
        { name: '9" Pizza: Cheese, Sausage or Pepperoni', price: 9.0 },
        { name: "House Salad and Bowl of Soup", price: 9.0 },
        {
          name: "Half Specialty Sandwich and House Salad or Cup of Soup",
          price: 9.0,
        },
        { name: "Basket of Bread or Sweet Potato Chips", price: 9.0 },
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
          price: 6.5,
        },
        {
          name: "GRILLED OCTOPUS",
          description:
            "cannelloni beans, arugula, fresh herbs, and lemon balsamic",
          price: 11.0,
        },
        {
          name: "MEATBALLS",
          description: "our famous all-beef meatballs in marinara",
          price: 8.0,
        },
        {
          name: "SOUP OF THE DAY",
          description: "made in house, changes daily",
          price: 3,
          sizes: [
            {
              name: "Cup",
              price: 0,
            },
            {
              name: "Bowl",
              price: 3,
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
          price: 13.0,
          options: [
            {
              name: "Add Chicken",
              price: 4,
            },
            {
              name: "Extra dressing",
              price: 0.75,
            },
          ],
        },
        {
          name: "GRILLED CHICKEN SALAD",
          description:
            "romaine, tomato, mozzarella, red onion, red cabbage with italian dressing",
          price: 15.0,
          options: [
            {
              name: "Extra dressing",
              price: 0.75,
            },
          ],
        },
        {
          name: "INSALATA CAPRESE",
          description: "shingled tomato, mozzarella, red onion, basil",
          price: 13.0,
          options: [
            {
              name: "Extra dressing",
              price: 0.75,
            },
          ],
        },
        {
          name: "MIXED GREENS",
          description: "tomato, red onion, and balsamic vinaigrette",
          price: 11.0,
          options: [
            {
              name: "Add Chicken",
              price: 4,
            },
            {
              name: "Extra dressing",
              price: 0.75,
            },
          ],
        },
        {
          name: "SHRIMP SALAD",
          description:
            "romaine, tomato, mozzarella, red onion, red cabbage with italian dressing",
          price: 18.0,
          options: [
            {
              name: "Add Chicken",
              price: 4,
            },
            {
              name: "Extra dressing",
              price: 0.75,
            },
          ],
        },
        {
          name: "WALNUT-GORGONZOLA",
          description:
            "arugula, shaved pear, and tomato with walnut dijon vinaigrette",
          price: 13.0,
          options: [
            {
              name: "Add Chicken",
              price: 4,
            },
            {
              name: "Extra dressing",
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
          price: 16.0,
          pastas: [
            {
              name: "Whole wheat Pasta",
              price: 2,
            },
            {
              name: "Gluten free Pasta",
              price: 2,
            },
          ],
          options: [
            {
              name: "Add Chicken",
              price: 4,
            },
          ],
        },
        {
          name: "ASIAGO STUFFED GNOCCHI",
          description: "with a homemade meatball",
          price: 21.0,
        },
        {
          name: "BAKED RIGATONI",
          description: "with ricotta, mozzarella and marinara",
          price: 16.0,
          pastas: [
            {
              name: "Whole wheat Pasta",
              price: 2,
            },
            {
              name: "Gluten free Pasta",
              price: 2,
            },
          ],
          options: [
            {
              name: "Add Chicken",
              price: 4,
            },
          ],
        },
        {
          name: "CHEESE LASAGNA",
          description: "with marinara or meat sauce",
          price: 10,
          sauces: [
            {
              name: "Marinara Sauce",
              price: 0,
            },
            {
              name: "Meat Sauce",
              price: 2,
            },
          ],
          options: [
            {
              name: "Add Chicken",
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
          price: 14.0,
          options: [
            {
              name: "Add Chicken",
              price: 4,
            },
          ],
        },
        {
          name: "CONCHIGLIETTI",
          description: "with fresh herbed tomato.",
          price: 9.0,
          pastas: [
            {
              name: "Whole wheat Pasta",
              price: 2,
            },
            {
              name: "Gluten free Pasta",
              price: 2,
            },
          ],
          options: [
            {
              name: "Add Chicken",
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
          name: "FARFALLE AND CHICKEN",
          description: "with zucchini and tomatoes in white wine and lemon",
          price: 16.0,
          pastas: [
            {
              name: "Whole wheat Pasta",
              price: 2,
            },
            {
              name: "Gluten free Pasta",
              price: 2,
            },
          ],
        },
        {
          name: "FARFALLE AND SALMON",
          description: "asparagus, tomato, white wine, topped with parmesan",
          price: 21.0,
          pastas: [
            {
              name: "Whole wheat Pasta",
              price: 2,
            },
            {
              name: "Gluten free Pasta",
              price: 2,
            },
          ],
          options: [
            {
              name: "Add Chicken",
              price: 4,
            },
          ],
        },
        {
          name: "HOMEMADE SPINACH GNOCCHI",
          description: "light marinara, basil, parmesan, and tomatoes",
          price: 16.0,
          options: [
            {
              name: "Add Chicken",
              price: 4,
            },
          ],
        },
        {
          name: "LINGUINE MARINARA",
          description: "with our famous all-beef meatballs",
          price: 12.0,
          pastas: [
            {
              name: "Whole wheat Pasta",
              price: 2,
            },
            {
              name: "Gluten free Pasta",
              price: 2,
            },
          ],
          options: [
            {
              name: "Add Chicken",
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
          name: "LINGUINE SHRIMP SCAMPI",
          description: "with tomatoes, pine nutes, and parmesan cheese",
          price: 21.0,
          pastas: [
            {
              name: "Whole wheat Pasta",
              price: 2,
            },
            {
              name: "Gluten free Pasta",
              price: 2,
            },
          ],
          options: [
            {
              name: "Add Chicken",
              price: 4,
            },
          ],
        },
        {
          name: "LINGUINE WITH CLAMS AND MUSSELS",
          description: "prosciutto, white wine, & flakes of red pepper",
          price: 21.0,
          pastas: [
            {
              name: "Whole wheat Pasta",
              price: 2,
            },
            {
              name: "Gluten free Pasta",
              price: 2,
            },
          ],
          options: [
            {
              name: "Add Chicken",
              price: 4,
            },
          ],
        },
        {
          name: "RIGATONI AND RICOTTA",
          description: "with mozzarella, percorino, and marinara sauce",
          price: 10.0,
          pastas: [
            {
              name: "Whole wheat Pasta",
              price: 2,
            },
            {
              name: "Gluten free Pasta",
              price: 2,
            },
          ],
          options: [
            {
              name: "Add Chicken",
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
          name: "RIGATONI PRIMAVERA",
          description: "broccoli, garlic, olive oil, and parmesan",
          price: 10.0,
          pastas: [
            {
              name: "Whole wheat Pasta",
              price: 2,
            },
            {
              name: "Gluten free Pasta",
              price: 2,
            },
          ],
          options: [
            {
              name: "Add Chicken",
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
          name: "SPINACH LASAGNA",
          description:
            "with ricotta, mozzarella, and herbed tomato cream sauce",
          price: 12.0,
          options: [
            {
              name: "Add Chicken",
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
          price: 20.0,
          pastas: [
            {
              name: "Whole wheat Pasta",
              price: 2,
            },
            {
              name: "Gluten free Pasta",
              price: 2,
            },
          ],
          options: [
            {
              name: "Add Chicken",
              price: 4,
            },
          ],
        },
        {
          name: "TORTELLINI DELLA NONNA",
          description:
            "beef filled pasta with spinach, prosciutto, & white cream sauce",
          price: 18.0,
          options: [
            {
              name: "Add Chicken",
              price: 4,
            },
          ],
        },
        {
          name: "ZITI PRIMAVERA",
          description:
            "green beans, mushrooms, tomatoes, onions, olive oil, and mozzarella",
          price: 14.0,
          pastas: [
            {
              name: "Whole wheat Pasta",
              price: 2,
            },
            {
              name: "Gluten free Pasta",
              price: 2,
            },
          ],
          options: [
            {
              name: "Add Chicken",
              price: 4,
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
          price: 13.0,
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
          price: 14.0,
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
          price: 13.0,
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
          price: 12.0,
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
          price: 13.0,
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
          price: 12.0,
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
          price: 14.0,
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
          price: 24.0,
        },
        {
          name: "CHICKEN PARMIGIANO",
          description:
            "lightly breaded chicken breasts on a bed of linguine marinara, topped with melted parmesan",
          price: 19.0,
        },
        {
          name: "VEAL SCALOPPINE",
          description:
            "with sautéed spinach, gorgonzola, and creamy wild mushroom marsala",
          price: 24.0,
        },
        {
          name: "LAMB SHANK",
          description:
            "on the bone lamb shank with mustard glaze, rosemary mashed potatoes and grilled asparagus with fresh basil sauce",
          price: 29.0,
        },
        {
          name: "ORGANIC PETITE CHICKEN",
          description:
            "pan-roasted whole and semi-deboned on broccoli sautéed with garlic, pine nuts, oven-roasted tomato, and sage crema broth",
          price: 22.0,
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
          price: 28.0,
        },
        {
          name: "GRILLED SALMON",
          description:
            "fresh Atlantic salmon on cannellini beans, roasted tomato, leeks, pancetta, arugula, and fresh herb broth",
          price: 23.0,
        },
        {
          name: "PAN-ROASTED BRONZINI",
          description:
            "mediterranean sea bass on sautéed jicama, green beans, roasted sweet corn, tomatoes, leeks with fire-roasted citrus sauce",
          price: 30,
        },
        {
          name: "SHRIMP RISOTTO",
          description:
            "with fresh basil, lemon, roasted tomatoes, and flakes of red pepper",
          price: 21.0,
        },
      ],
    },
    {
      header: "SIDES",
      items: [
        {
          name: "BROCCOLI",
          price: 4.0,
        },
        {
          name: "DINNER SALAD WITH HOUSE-MADE ITALIAN DRESSING",
          price: 5.0,
        },
        {
          name: "GRILLED ASPARAGUS",
          price: 4.0,
        },
        {
          name: "GRILLED CHICKEN",
          price: 5.0,
        },
        {
          name: "MEATBALL",
          price: 4.5,
        },
        {
          name: "PASTA: PLAIN, BUTTERED, MARINARA, OR OLIVE OIL",
          price: 8,
        },
        {
          name: "SAUTÉED SHRIMP",
          price: 7,
        },
      ],
    },
    {
      header: "DESSERTS",
      items: [
        {
          name: "HAZELNUT PEAR TART",
          description: "Served warm, with amaretto sauce and coffee gelato",
          price: 9.5,
        },
        {
          name: "LIMÓNCELLO CRÉME BRULEE",
          description: "With fresh berries",
          price: 7,
        },
        {
          name: "MOLTEN CHOCOLATE CAKE",
          description: "Served warm, with raspberry sauce and vanilla gelato",
          price: 8.5,
        },
        {
          name: "TIRAMISU",
          description: "With fresh berries",
          price: 9,
        },
      ],
    },
    {
      header: "DRINKS",
      items: [
        {
          name: "COFFEE",
          price: 3.5,
        },
        {
          name: "HOT TEA, FRESH BREWED ICE TEA",
          price: 3.5,
        },
        {
          name: "MILK",
          price: 2.95,
        },
        {
          name: "ORANGE OR LEMON SAN PELLEGRINO 6OZ",
          price: 3.75,
        },
        {
          name: "RC, DIET RITE, GREEN RIVER, 7-UP, ROOT BEER, LEMONADE, CRANBERRY JUICE",
          price: 3.75,
        },
        {
          name: "SAN PELLEGRINO MINERAL WATER 33OZ",
          price: 5,
        },
        {
          name: "SMERALDINA SPARKLING WATER 8.47OZ",
          price: 3.75,
        },
      ],
    },
    {
      header: "BEER",
      items: [
        {
          name: "AMSTEL LIGHT",
          price: 6,
        },
        {
          name: "HEINEKEN",
          price: 6,
        },
        {
          name: "HEINEKEN 0.0 NON-ALCOHOLIC",
          price: 5,
        },
        {
          name: "MILLER LITE",
          price: 6,
        },
        {
          name: "MORETTI",
          price: 6,
        },
        {
          name: "PERONI",
          price: 6,
        },
        {
          name: "ROGUE DEAD GUY ALE",
          price: 6.25,
        },
        {
          name: "SKETCHBOOK ORANGE DOOR IPA",
          price: 6.25,
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
          price: 30,
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
        },
        {
          name: "Tiamo Prosecco, Italy",
          description:
            "this effusive fruity, light-bodied effervescent wine offers terrific notes with a refreshing finish",
        },
      ],
    },
    {
      header: "WHITE",
      items: [
        {
          name: "Alois Lageder Chardonnay, Alto Adige, Italy",
          description:
            "the aroma is delicate with pronounced notes of subtropical fruit. quite intense in flavor and lively acidity",
          price: 42.5,
        },
        {
          name: "Bex Riesling, Germany",
          description:
            "notes of honeysuckle flowers, fresh pineapple, apricot tart, fresh peach and nectarine with a creamy, almost whipped cream finish",
          price: 28,
        },
        {
          name: "Beyond Savignon Blanc, South Africa",
          description:
            "organically produced with guava and fresh herbal aromas. the full-bodied palate exudes fresh herbs, nettle and a long mineral finish",
          price: 28,
        },
        {
          name: "Feudi Di San Gregorio Falanghina, Italy",
          description:
            "this 100% falanghina is a captivating, aromatic white wine with flavors of lush tropical fruits. enjoy with seafood, chicken, or pasta",
          price: 33,
        },
        {
          name: "Le Pianure Pinot Grigio, Delle Venezie, Italy",
          description:
            "light-medium bodied, fresh and complex with flavors of lemon, apple and sage, backed with subtle minerality",
          price: 31,
        },
      ],
    },
    {
      header: "RED",
      items: [
        {
          name: "Castle Rock Pinot Noir, California",
          description:
            "the palate is bright and lifted, with luscious flavors of cherry pie, chocolate and vanilla. further enhanced by notes of anise and brown spice",
          price: 34,
        },
        {
          name: "Cetamura Chianti, Italy",
          description:
            "intense ruby red color with aromas of berries and flowers. perfect with simple and genuine flavors of Tuscan cuisine",
          price: 34,
        },
        {
          name: "Crow Canyon Merlot, California",
          description: "easy going with plummy, velvety notes",
          price: 24,
        },
        {
          name: "Giancarlo Montepulciano, D'Abruzzo, Italy",
          description:
            "spicy, herby, dark fruit characters, balanced acidity with good body and width. no oak gives this wine vibrancy and depth rarely seen at this price",
          price: 26,
        },
        {
          name: "House Red - Fluer De Lyeth Red Blend, California",
          description:
            "a blend of Cabernet Sauvignon, Merlot and Malbec. luscious flavors of Bing cherry, plum and a touch of berry. very smooth and easy drinking.",
          price: 27,
        },
        {
          name: "Le Bocce Chianti Classico, Italy",
          description:
            "rich and resonant flavors of plum, cocoa and blackberry fruits. old vines and ancient soils can only produce a wine so balanced and deeply satisfying",
          price: 42,
        },
        {
          name: "Milbrandt Cabernet Sauvignon, Washington",
          description:
            "round and robust with notes of dry plum, fresh blackberry jam, and ripe strawberry",
          price: 32,
        },
        {
          name: "Oxford Landing Shiraz, Australia",
          description:
            "soft and supple with lingering flavors of red cherry, raspberry, and licorice. a small amount of Viognier is blended in to enhance the Shiraz",
          price: 24,
        },
        {
          name: "Stefano Farina Barbera D'Alba, Italy",
          description:
            "the color is intense ruby red with a rich aroma. red fruit dominates the palate, with subtle notes of flowers that finishes with velvety tannins.",
          price: 28,
        },
        {
          name: "Zuccardi Malbec, Argentina",
          description:
            "purple-black color and bursting with blackcurrant and plum aromas. full-bodied with rich black cherry and chocolate notes and a velvety finish",
          price: 35,
        },
      ],
    },
  ],
};

const port = process.env.PORT || 4000;
const mongo_uri = process.env.MONGO_URI;

async function main() {
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
    delete sectionData.items; // We will save items separately

    const section = new Section({
      ...sectionData,
      menuId: menuId, // Associate section with menu
    });
    await section.save();

    sectionIds.push(section._id);

    // Save all items concurrently for a section
    const itemPromises = items.map((itemData) => {
      const item = new Item({
        ...itemData,
        sectionId: section._id, // Associate item with section
        menuId: menuId, // Associate item with menu
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
