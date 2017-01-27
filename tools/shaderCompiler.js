var fs = require("fs");

function parseShader(file, path) {
    var buffer = fs.readFileSync(path + file);
    var string = buffer.toString().replace(/[ \t]*\/\/.*\n/g, '')
          .replace(/[ \t]*\/\*[\s\S]*?\*\//g, '')
          .replace(/\n{2,}/g, '\n');

    return string;
}

function compileShader(inputPath, outputPath, outputName, spaceName) {
    fs.readdir(inputPath, function(err, files) {
        if(err) {
            return console.log(err);
        }

        var all = "(function(){\n" + spaceName + "." + outputName + " = {\n";

        for(var i = 0; i < files.length; i++) {
            var file = files[i];

            var name = file.replace(/\.glsl$/, "");

            all += name + ": " + JSON.stringify(parseShader(file, inputPath)) + ",\n";
        }

        all += "}\n";

        all += "})();";

        fs.writeFile(outputPath + outputName +".js", all, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file " + outputName + ".js" + " was saved!");
        });
    });
}

exports.compileShader = compileShader;
