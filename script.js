(function () {

    // Data and settings
    const mainSize = Math.PI / 3;
    const subSize = ((Math.PI - (Math.PI / 3)) / 3);
    const actionsData = [
        {
            "label": "main",
            "value": mainSize
        },
        {
            "label": "home",
            "value": subSize
        },
        {
            "label": "food",
            "value": subSize
        },
        {
            "label": "play",
            "value": subSize
        },
    ];

    const mainData = [{
        "label": "dog",
        "unicode": "",
        "value": 25,
        "color": "#3182bd",
        "subcolor": "#ccc"
    }, {
        "label": "cat",
        "unicode": "",
        "value": 25,
        "color": "#6baed6",
        "subcolor": "#ccc"
    }, {
        "label": "dragon",
        "unicode": "",
        "value": 25,
        "color": "#5FB49C",
        "subcolor": "#ccc"
    }, {
        "label": "horse",
        "unicode": "",
        "value": 25,
        "color": "#414288",
        "subcolor": "#ccc"
    }, {
        "label": "kiwi",
        "unicode": "",
        "value": 25,
        "color": "#e6550d",
        "subcolor": "#ccc"
    }, {
        "label": "spider",
        "unicode": "",
        "value": 25,
        "color": "#fd8d3c",
        "subcolor": "#ccc"
    }];

    const actionIcons = ["", "", ""]

    // Main size & radius of pie chart
    const width = 450,
        height = 450,
        radius = Math.min(width, height) / 2;

    // Create an arc Generator
    const arcGenerator = d3.arc()
        .innerRadius(radius - 130)
        .outerRadius(radius - 10);

    // Create a pie Generator
    const pie = d3.pie()
        .value((d) => { return d["value"]; })
        .sort(null);

    // Append SVG attributes and append g to the SVG
    const svgMain = d3.select("#main-chart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");

    // Define inner circle
    svgMain.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 100)
        .attr("fill", "#F5F1ED");

    // Creating Options (paths and events)
    const mainG = svgMain.selectAll(".arc")
        .data(pie(mainData))
        .enter().append("g")
        .attr("class", "arc")
        .attr("id", (d) => {
            return d.data.label;
        })
        .on("click", (d, i) => {
            const currentLabel = mainData[i].label;
            createSubArc(d);
            toggleArcs();
            highlighSelection(currentLabel);
        })
        .on("mouseover", (d, i) => {
            const currentLabel = mainData[i].label;
            toggleLabelIcon(currentLabel);
        })
        .on("mouseout", (d, i) => {
            const currentLabel = mainData[i].label;
            toggleLabelIcon(currentLabel);
        });

    // Append the path to each g
    mainG.append("path")
        .attr("d", arcGenerator)
        .attr("fill", (d) => {
            return d.data.color;
        });

    // Append Icons to each group and put them at the center of pie section
    mainG.append("text")
        .attr("class", (d) => {
            return "icon-elem fa " + d.data.label;
        })
        .attr("transform", (d) => {
            return "translate(" + arcGenerator.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .attr("fill", "#fff")
        .text((d) => {
            return d.data.unicode;
        })

    // Append labels to each group and keep them at the center of the svg
    mainG.append("text")
        .attr("class", (d) => {
            return `inner-label ${d.data.label}`;
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("fill", "#fff")
        .text((d) => {
            return `${d.data.label}`;
        });

    svgMain.append("g")
        .attr('id', 'action-messages')
        .append("text")
        .attr('class', 'inner-label action')
        .attr("dy", ".35em")
        .style("text-anchor", "middle");


    /* CREATING SUB MENUS */

    const createSubArc = ((item) => {

        // uses a dynamic pie generator to create arcs according to items start and end angle
        const pieGenerator = d3.pie()
            .startAngle(item.startAngle)
            .endAngle(item.startAngle + (1 * Math.PI))
            .value((d) => { return d.value; });

        const arcData = pieGenerator(actionsData);

        // Create arc element with it's sub menu options
        d3.select('#sub-menu g')
            .selectAll('path')
            .data(arcData)
            .enter()
            .append('g')
            .attr('class', ((d, i) => {
                if (i === 0) {
                    return 'arc-sub main-sub';
                }
                return 'arc-sub'
            }))
            .append('path')
            .attr('d', arcGenerator)
            .style('fill', (d) => {
                return item.data.color;
            })
            .transition()
            .style('fill', ((d, i) => {
                if (i === 0) {
                    return item.data.color;
                }
                return item.data.subcolor;
            }))
            .duration(100)

        // Add click event to sub-menu
        d3.select('.arc-sub')
            .on("click", (d) => {
                clearSVG();
                toggleArcs();
                removeHighlight();
            });

        // Add labels to each option inside the arc
        d3.selectAll('#sub-menu g .arc-sub')
            .append("text")
            .attr("class", (d) => {
                return "icon-elem fa " + item.data.label;
            })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .attr("fill", (d, i) => {
                if (i === 0) {
                    return '#fff';
                }
                return item.data.color;
            })
            .attr("transform", (d) => {
                return "translate(" + arcGenerator.centroid(d) + ")";
            })
            .text((d, i) => {
                if (i === 0) {
                    return item.data.unicode;
                }
                return actionIcons[i - 1];
            })
            .on("click", (d) => {
                console.log('clicked event', d.data.label);
            })
            .on("mouseover", (d) => {
                if (d.data.label !== 'main') {
                    showActionLabel(d.data.label);
                }
            })
            .on("mouseout", (d) => {
                const textElem = document.querySelector('.inner-label.action');
                textElem.innerHTML = '';
            })

    });


    const toggleArcs = (() => {
        let mainArc = document.querySelector('#main-chart');
        let subArc = document.querySelector('#sub-menu');
        let mainArcOnTop = mainArc.classList.contains('is-surfaced');

        if (mainArcOnTop) {
            mainArc.classList.remove('is-surfaced');
            mainArc.classList.add('is-under');
            subArc.classList.remove('is-under')
            subArc.classList.add('is-surfaced');
        } else {
            mainArc.classList.add('is-surfaced');
            mainArc.classList.remove('is-under');
            subArc.classList.add('is-under')
            subArc.classList.remove('is-surfaced');
        }
    });

    const highlighSelection = ((selection) => {
        const allMainArcs = document.querySelectorAll('.arc');
        allMainArcs.forEach((arc) => {
            if (arc.id !== selection) {
                arc.setAttribute('style', 'opacity:0.5');
            }
        })
    });

    const removeHighlight = (() => {
        const allMainArcs = document.querySelectorAll('.arc');
        allMainArcs.forEach((arc) => {
            arc.removeAttribute('style');
        });
    });

    const clearSVG = (() => {
        let elem = document.querySelector('#sub-menu g');
        elem.textContent = '';
    });

    const showActionLabel = ((label) => {
        const textElem = document.querySelector('.inner-label.action');
        textElem.textContent = label;
        textElem.setAttribute('style', 'display:block');
    })

    const toggleLabelIcon = ((currentLabel) => {
        const label = document.querySelector(`.inner-label.${currentLabel}`);
        const icon = document.querySelector(`.icon-elem.fa.${currentLabel}`);
        const isLabelVisible = label.classList.contains('is-visible');
    
        if (isLabelVisible) {
            label.classList.remove('is-visible');
            icon.classList.remove('is-hover');
        } else {
            label.classList.add('is-visible');
            icon.classList.add('is-hover');
        }
    })
})();
