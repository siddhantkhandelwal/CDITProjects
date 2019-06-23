$(() => {
    const inpRollNo = $("#rollNo");
    const verify1=$("#checkRollNo");
    const firstName=$("#firstName");
    const surName=$("#surName");
    const male=$("#gridRadios1");
    const female=
    verify1.click(() => {
      firstName.val("Suraj");
      surName.val("Menon");
      if(male)
        male.prop('checked',true);
      

    });
});
