<?php
// Function to read and update the visitor count from a file
function getVisitorCount() {
    $count = 0;
    $countFile = "visitor_count.txt"; // Replace with a suitable file path

    if (file_exists($countFile)) {
        $count = intval(file_get_contents($countFile));
    }

    $count++; // Increment the count

    file_put_contents($countFile, $count); // Update the count in the file

    return $count;
}

// Call the function and return the count
echo getVisitorCount();
?>

